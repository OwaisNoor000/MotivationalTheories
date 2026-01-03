from collections import defaultdict
from fastapi import FastAPI,HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import json
import os
from fastapi.middleware.cors import CORSMiddleware
from ai.classify import extractQuestion,classifyQuestions,generateReport,addRecommendationsToReport
from ai.rank import rankAnswers
import time
from baml_client.types import MaslowQuestionAnswerPair, HerzbergQuestionAnswerPair,McClellandQuestionAnswerPair
from schemas import *


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","http://16.16.185.51:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/survey")
def saveSurvey(params:CreateSurveyRequest):
    fileNames = os.listdir("database/surveys") 

    if f"{params.fileName}.json" in fileNames:
        return JSONResponse(content={"error":"file name already exists"},status_code=201)

    with open(f"database/surveys/{params.fileName}.json","w") as file:
        json.dump(params.surveyJson,file)

    return JSONResponse(content={"success":True},status_code=200)



@app.put("/survey")
def updateSurvey(params:CreateSurveyRequest):
    fileNames = os.listdir("database/surveys") 
    
    if f"{params.fileName}.json" not in fileNames:
        return JSONResponse(content={"error":"survey does not exist"},status_code=201)

    with open(f"database/surveys/{params.fileName}.json","w") as file:
        json.dump(params.surveyJson,file)

    return JSONResponse(content={"success":True},status_code=200)

@app.get("/survey/metadata")
async def getSurveyMetadata():
    surveyMetadata = []
    for fileName in os.listdir("database/surveys"):
        questionCount = 0
        with open(f"database/surveys/{fileName}","r") as file:
            content = json.load(file)
        for page in content["pages"]:
            questionCount+=len(page["elements"])
        surveyMetadata.append({
            "name":fileName.removesuffix(".json"),
            "questions":questionCount
        })

    return JSONResponse(content=surveyMetadata,status_code=200)

@app.get("/survey/{surveyId}")
async def getSurveyDataById(surveyId:str):
    fileNames = [fn.removesuffix(".json") for fn in os.listdir("database/surveys")]
    if surveyId not in fileNames:
        return {"error":"file not found"}

    file = [fn for fn in fileNames if fn==surveyId][0]

    with open(f"database/surveys/{file}.json","r") as jsonFile:
       surveyData = jsonFile.read()

    return surveyData


@app.post("/survey/{surveyId}/answer/{answerId}")
def saveSurveyResponse(surveyId:str,answerId:str,params:SurveyAnswersRequest):

    answeredSurveys = os.listdir("database/answers")
    
    # presence check for surveyId
    surveyIds = [fn.removesuffix(".json") for fn in os.listdir("database/surveys")]
    if surveyId not in surveyIds:
        return HTTPException(code=404,detail="surveyId provided does not exist in the database")

    if surveyId not in answeredSurveys:
        os.mkdir(f"database/answers/{surveyId}")
    else:
        existingAnswerIds = [fn.removesuffix(".json") for fn in os.listdir(f"database/answers/{surveyId}")]
        if answerId in existingAnswerIds:
            return HTTPException(status_code=404,detail="answerId already exists")

    with open(f"database/answers/{surveyId}/{answerId}.json","w") as file:
        json.dump(params.answersJson,file)

    return JSONResponse(status_code=200,content={"message":"sucessful"})



@app.get("/survey/{surveyId}/answer/{answerId}")
def getSurveyAnswers(surveyId:str,answerId:str):
    # presence check for surveyId 
    surveyIds = [fn.removesuffix(".json") for fn in os.listdir("database/surveys")]
    if surveyId not in surveyIds:
        return HTTPException(code=404,detail="surveyId provided does not exist in the database")

    answerIds = [fn.removesuffix(".json") for fn in os.listdir(f"database/answers/{surveyId}")]
    if answerId not in answerIds:
        return HTTPException(code=404,detail="answerId provided does not exist in the database")

    with open(f"database/answers/{surveyId}/{answerId}.json","r") as file:
        answersJson = json.load(file)

    return JSONResponse(status_code=200,content=answersJson)

@app.get("/survey/{surveyId}/answer")
def getAllAnswerNames(surveyId:str):
    # presence check
    surveyIds = [fn.removesuffix(".json") for fn in os.listdir("database/surveys")]
    if surveyId not in surveyIds:
        return HTTPException(code=404,detail="surveyId provided does not exist in the database")

    if surveyId not in [id for id in os.listdir("database/answers")]:
        return JSONResponse(status_code=200,content={})

    answerIds = [fn.removesuffix(".json") for fn in os.listdir(f"database/answers/{surveyId}")]
    return JSONResponse(status_code=200,content={"answerIds":answerIds})
    

@app.post("/survey/classification/report")
def generateClassificationReport(params:SurveyClassificationRequest):

    surveyIds = [fn.removesuffix(".json") for fn in os.listdir("database/surveys")]
    if params.surveyId not in surveyIds:
        return HTTPException(status_code=404,detail="surveyId provided does not exist in the database")


    os.makedirs(f"database/evaluations/survey/{params.surveyId}",exist_ok=True)
    existingEvaluations = set([fn.split("-")[0] for fn in os.listdir(f"database/evaluations/survey/{params.surveyId}")])
    if(params.theory.value in existingEvaluations and not params.overwrite):
        return HTTPException(status_code=409,detail="an evaluation for the survey provided already exists")
        

    questions = extractQuestion(params.surveyId)
    classifications = classifyQuestions(questions,theory=params.theory)
    report = generateReport(classifications=classifications,theory=params.theory)
    suggestions = addRecommendationsToReport(report,classifications,params.theory) #modifies the report variable

    with open(f"database/surveys/{params.surveyId}.json") as file:
        survey = json.load(file)
    
    additionalQuestionData = []
    for p,page in enumerate(survey["pages"]):
        for element in page["elements"]:
            entry = {
                "questionType":element["type"],
                "page":p+1
                }
            additionalQuestionData.append(entry)

    i=0
    newClassification = []
    while i < len(classifications):
        entry = {
            "question":classifications[i].question,
            "classification":classifications[i].classification,
            "page":additionalQuestionData[i]["page"],
            "questionType":additionalQuestionData[i]["questionType"]
        }
        newClassification.append(entry)
        i+=1



    result = {
        # "classifications":[c.model_dump() for c in classifications],
        "classifications":newClassification,
        "report":report.to_dict(),
        "suggestions":[{"category":s["category"],
                        "suggestedQuestions":[i.model_dump() for i in s["suggestedQuestions"]]} 
                        for s in suggestions]
    }

    # save report
    fileIndex = int(time.time())
    with open(f"database/evaluations/survey/{params.surveyId}/{params.theory.value}-{fileIndex}.json",'w') as file:
        json.dump(result,file)
    
    result["index"] = fileIndex

    return JSONResponse(status_code=200,content=result)


# @app.patch("/survey/:surveyId")
# def addQuestionsToSurvey(surveyId:str,)

@app.post("/survey/classification")
def checkExistingReports(params:ReportCheckRequest):
    surveysWithReports = os.listdir("database/evaluations/survey")
    if params.surveyId not in surveysWithReports:
        return JSONResponse(status_code=200,content={"existing":False,"entries":[]})

    entries = [{"theory":fn.split("-")[0],"index":fn.split("-")[1].removesuffix(".json")} for fn in os.listdir(f"database/evaluations/survey/{params.surveyId}")] 
    print(entries)
    entries = [entry for entry in entries if entry["theory"]==params.theory.value]
    print(entries)

    if entries == []:
        print("branch1")
        return JSONResponse(status_code=200,content={"existing":False,"entries":[]})
        
    result = []
    for entry in entries:
        try:
            with open(f"database/evaluations/survey/{params.surveyId}/{entry['theory']}-{entry['index']}.json") as file:
                contents = json.load(file)
            entry["contents"] = contents
            contents["index"] = entry["index"]
            result.append(contents)
        except Exception as e:
            continue



    

    print("branch2")
    return JSONResponse(status_code=200,content=result)
    
def matches(value, target):
    if isinstance(target, (list, tuple, set)):
        return value in target
    return value == target


def build_answer_report(result: list) -> list[AnswerReportEntry]:
    totals = defaultdict(float)
    counts = defaultdict(int)

    for item in result:
        score = float(item.score)

        for category in item.category:
            totals[category] += score
            counts[category] += 1

    report: list[AnswerReportEntry] = []

    for category, total in totals.items():
        entry = AnswerReportEntry()
        entry.category = category
        entry.score = total / counts[category]
        report.append(entry)

    return report

@app.post("/survey/answer/rank")
def getAnswerRankings(params:AnswerRankRequest):
    pairs:Union[List[MaslowQuestionAnswerPair],List[HerzbergQuestionAnswerPair],List[McClellandQuestionAnswerPair]] = []

    

    with open(f"database/surveys/{params.surveyId}.json","r") as file:
        survey = json.load(file)

    with open(f"database/answers/{params.surveyId}/{params.answerId}.json","r") as file:
        answers = json.load(file)

    # get the latest evaluations
    latestEvaluation = [fn for fn in os.listdir(f"database/evaluations/survey/{params.surveyId}") if fn.split("-")[0]==params.theory.value][-1]
    print("evaliuationIndex",latestEvaluation)
    with open(f"database/evaluations/survey/{params.surveyId}/{latestEvaluation}") as file:
        evaluation = json.load(file)

    questionIndex = 0 
    for page in survey["pages"]:
        for element in page["elements"]:
            questionId = element["name"]
            print("questionId",questionId)
            print("answers",answers.keys())
            print("condition1",questionId in answers.keys())
            if questionId in answers.keys():
                answer = answers[questionId]
                print("questionIndex",questionIndex)
                category = evaluation["classifications"][questionIndex]["classification"]
                choices = []

                print("category",category)
                if "Other" in category:
                    questionIndex+=1
                    continue
                else:
                    questionTitle = element["title"]
                    if "choices" in element.keys():
                        choices = element["choices"]

                    if params.theory == MotivationTheory.Maslow:
                        print("test0001",choices)
                        ch = [choice["text"] for choice in choices if matches(choice["value"],answer)]
                        if len(ch)>0:
                            ch = ch[0]
                        else:
                            ch = answer
                        print("ch",ch)
                        pair = MaslowQuestionAnswerPair(question=questionTitle,answer=ch,choices=[choice["text"] for choice in choices],category=category)
                        pairs.append(pair)
                    elif params.theory == MotivationTheory.Herzberg:
                        ch = [choice["text"] for choice in choices if matches(choice["value"],answer)]
                        if len(ch)>0:
                            ch = ch[0]
                        else:
                            ch = answer
                        pair = HerzbergQuestionAnswerPair(question=questionTitle,answer=ch,choices=[choice["text"] for choice in choices],category=category)
                        pairs.append(pair)
                    elif params.theory == MotivationTheory.Mcclelland:
                        ch = [choice["text"] for choice in choices if matches(choice["value"],answer)]
                        if len(ch)>0:
                            ch = ch[0]
                        else:
                            ch = answer
                        pair = McClellandQuestionAnswerPair(question=questionTitle,answer=ch,choices=[choice["text"] for choice in choices],category=category)
                        pairs.append(pair)

            questionIndex+=1

    result =rankAnswers(params.theory,pairs=pairs)

    report:List[AnswerReportEntry] = build_answer_report(result)
    averageScore = sum([entry.score for entry in report])/len(report)


    for r in report:
        print(r.to_dict())

    response = {"table":[r.model_dump() for r in result],"report":[r.to_dict() for r in report],"averageScore":averageScore}

    # create required folders if nonexistent
    os.makedirs(f"database/evaluations/answer/{params.surveyId}/{params.answerId}",exist_ok=True)
    fileIndex = int(time.time())
    with open(f"database/evaluations/answer/{params.surveyId}/{params.answerId}/{params.theory.value}-{fileIndex}.json","w") as file:
        json.dump(response,file)
    

    return JSONResponse(status_code=200,content=response)

@app.get("/eligibility")
def generateEligibilityReport():
    surveyIds = [fn.removesuffix(".json") for fn in os.listdir("database/surveys")]
    reports = []
    for surveyId in surveyIds:
        criteriaReport = CriteriaReport()
        criteriaReport.eligible = []
        criteriaReport.ineligibleMessages = []
        criteriaReport.answerIds = []
        criteriaReport.surveyId = surveyId
        print("prior",surveyId)
        print(surveyId,os.listdir("database/answers"))
        if surveyId not in os.listdir("database/answers"):
            print("thjats the one",surveyId)
            criteriaReport.criteria = []
            criteriaReport.eligible=[False]*3
            criteriaReport.ineligibleMessages = [EligibilityMessage.NO_ANSWERS]*3
            reports.append(criteriaReport)
            continue
        answerIds = [fn.removesuffix(".json") for fn in os.listdir(f"database/answers/{surveyId}")]
        criteriaReport.answerIds = answerIds

        # check if evaluation exists
        if surveyId not in os.listdir("database/evaluations/survey"):
            criteriaReport.ineligibleMessages = [EligibilityMessage.NO_EVAL_GENERATED]*3
            criteriaReport.eligible = [False]*3
            reports.append(criteriaReport)
            continue

        # check evaluation existence and categorical proportions for all theories
        theoriesEvaluated = set([fn.split("-")[0] for fn in os.listdir(f"database/evaluations/survey/{surveyId}")])
        for theory in criteriaReport.theories:
            if theory.value not in theoriesEvaluated:
                criteriaReport.eligible.append(False)

                criteriaReport.ineligibleMessages.append(EligibilityMessage.NO_EVAL_GENERATED)
            else:
                # ensure that questions with category=Other are not more than 50%
                latestTheoryEvaluationFileName = [fn for fn in os.listdir(f"database/evaluations/survey/{surveyId}") if fn.split("-")[0] == theory.value][-1]
                with open(f"database/evaluations/survey/{surveyId}/{latestTheoryEvaluationFileName}") as file:
                    theoryEvaluation = json.load(file)
                totalQuestions = sum([record["count"] for record in theoryEvaluation["report"]])
                totalOtherQuestions = [record["count"] for record in theoryEvaluation["report"] if record["category"]=="Other"][0]
                percentage:float = totalOtherQuestions/totalQuestions*100

                if percentage >= 50:
                    criteriaReport.eligible.append(False)
                    criteriaReport.ineligibleMessages.append(EligibilityMessage.CATEROGORY_ISSUE)
                else:
                    criteriaReport.eligible.append(True)
                    criteriaReport.ineligibleMessages.append(EligibilityMessage.OKAY)
                    
        reports.append(criteriaReport)

    print("content",reports)
    return JSONResponse(status_code=200,content=[r.to_dict() for r in reports])
    
@app.get("/report/eligibility/{surveyId}/{answerId}/{theory}")
def getEligilityRecords(surveyId:str,answerId:str,theory:MotivationTheory):
    if not os.path.exists(f"database/evaluations/answer/{surveyId}/{answerId}"):
        # return HTTPException(status_code=409,detail="No answer evaluations exist for the provided surveyId and answerId")
        return JSONResponse(status_code=200,content=[])
    
    if theory.value not in set([fn.split("-")[0] for fn in os.listdir(f"database/evaluations/answer/{surveyId}/{answerId}")]):
        # return HTTPException(status_code=410,detail="No answer evaluations exist for this theory")
        return JSONResponse(status_code=200,content=[])
    
    records = []
    for fileName in os.listdir(f"database/evaluations/answer/{surveyId}/{answerId}"):
        if fileName.split("-")[0] == theory.value:
            with open(f"database/evaluations/answer/{surveyId}/{answerId}/{fileName}") as file:
                contents = json.load(file)
            records.append({"index":fileName.split("-")[1].removesuffix(".json"),"report":contents})

    return JSONResponse(status_code=200,content=records)

    
@app.get("/report/chart-data/{surveyId}/{theory}")
def getReportBarChartData(surveyId:str,theory:MotivationTheory):
    if surveyId not in os.listdir("database/evaluations/answer"):
        return JSONResponse(status_code=200,content=[])

    chartData = []
    for ansEvaluation in os.listdir(f"database/evaluations/answer/{surveyId}"):
        labelName = ansEvaluation
        latestFileName = [fn for fn in os.listdir(f"database/evaluations/answer/{surveyId}/{ansEvaluation}") if fn.split("-")[0] == theory.value]
        latestFileName = [] if len(latestFileName)==0 else latestFileName[-1]
        if latestFileName == []:
            continue


        with open(f"database/evaluations/answer/{surveyId}/{ansEvaluation}/{latestFileName}") as file:
            report = json.load(file)
        record = {
            "label":labelName,
            "averageScore":round(report["averageScore"],1),
            "categoricalScores":[
                record for record in report["report"]
            ]
        }
        chartData.append(record)

    return JSONResponse(status_code=200,content=chartData)

    


