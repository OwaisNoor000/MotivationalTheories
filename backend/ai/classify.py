from baml_client import b
from baml_client.types import MaslowClassification,ListQuestion,TextQuestion,HerzbergClassification,McClellandClassification,MaslowCategory,McClellandCategory,HerzbergCategory
from baml_client.types import Suggestion,QuestionSuggestion
from dotenv import load_dotenv
from typing import List,Union,Dict
import json
from enum import Enum
import math
from schemas import MotivationTheory,ClassificationRank,Report,ReportEntry

load_dotenv()



def extractQuestion(surveyId:str):
    with open(f"database/surveys/{surveyId}.json") as file:
        contents = json.load(file)

    questions:List[Union[ListQuestion,TextQuestion]] = []
    for page in contents["pages"]:
        for element in page["elements"]:
            if element["type"] in ["text","radiogroup","dropdown","checkbox"]:
                question = element["title"]
                q = TextQuestion(question=question)
                questions.append(q)
            elif element["type"] == "dropdown":
                question = element["title"]
                options = []
                for choice in element["choices"]:
                    options.append(choice["text"])
                q = ListQuestion(question=question,options=options)
                questions.append(q)

    return questions

        

def classifyQuestions(questions:List[Union[ListQuestion,TextQuestion]],theory:MotivationTheory)-> Union[List[MaslowClassification]
                                                                                                        ,List[HerzbergClassification],
                                                                                                        List[McClellandClassification]] :
    print(questions) 
    classification = None
    if theory==MotivationTheory.Herzberg:
        classification = b.ClassifyHerzberg(questions)
    if theory==MotivationTheory.Mcclelland:
        classification = b.ClassifyMcClelland(questions)
    if theory==MotivationTheory.Maslow:
        classification = b.ClassifyMaslow(questions)
    return classification

# questions = extractQuestion("employee-motivation-survey-1")
# classifications = classifyQuestions(questions,theory=MotivationTheory.Maslow)

# for c in classifications:
#     print(c.question)
#     print(c.classification,end="\n\n")



def maslowClassificationReport(classifications:List[MaslowClassification]):
    quantity = len(classifications)
    expectedQuestions = int(math.floor(quantity/5))

    categoricalCounts = {
        MaslowCategory.Belongingness:0,
        MaslowCategory.Esteem:0,
        MaslowCategory.Physiological:0,
        MaslowCategory.Safety:0,
        MaslowCategory.SelfActualization:0,
        MaslowCategory.Other:0,
    }

    for cl in classifications:
        for category in cl.classification:
            categoricalCounts[category]+=1

    

    entries:List[ReportEntry] = []

    for key in categoricalCounts:
        entry:ReportEntry = ReportEntry() 
        score = round(categoricalCounts[key]/expectedQuestions,1)
        rank = ClassificationRank.Good if score>0.8 else ClassificationRank.Okay if score>0.6 else ClassificationRank.Bad

        entry.category = key
        entry.count=categoricalCounts[key]
        entry.score=score
        entry.rank=rank
        entries.append(entry)

    report = Report()
    report.entries = entries

    return report


def herzbergClassificationReport(classifications: List[HerzbergClassification]):
    quantity = len(classifications)
    expectedQuestions = int(math.floor(quantity / 2))

    categoricalCounts = {
        HerzbergCategory.Hygiene: 0,
        HerzbergCategory.Motivator: 0,
        HerzbergCategory.Other: 0,
    }

    for cl in classifications:
        for category in cl.classification:
            categoricalCounts[category] += 1

    entries: List[ReportEntry] = []

    for key in categoricalCounts:
        entry = ReportEntry()
        score = round(categoricalCounts[key] / expectedQuestions, 1) if expectedQuestions > 0 else 0
        rank = (
            ClassificationRank.Good
            if score > 0.8
            else ClassificationRank.Okay
            if score > 0.6
            else ClassificationRank.Bad
        )

        entry.category = key
        entry.count = categoricalCounts[key]
        entry.score = score
        entry.rank = rank
        entries.append(entry)

    report = Report()
    report.entries = entries
    return report


def mcclelandClassificationReport(classifications: List[McClellandClassification]):
    quantity = len(classifications)
    expectedQuestions = int(math.floor(quantity / 3))

    categoricalCounts = {
        McClellandCategory.Achievement: 0,
        McClellandCategory.Affiliation: 0,
        McClellandCategory.Power: 0,
        McClellandCategory.Other: 0,
    }

    for cl in classifications:
        for category in cl.classification:
            categoricalCounts[category] += 1

    entries: List[ReportEntry] = []

    for key in categoricalCounts:
        entry = ReportEntry()
        score = round(categoricalCounts[key] / expectedQuestions, 1) if expectedQuestions > 0 else 0
        rank = (
            ClassificationRank.Good
            if score > 0.8
            else ClassificationRank.Okay
            if score > 0.6
            else ClassificationRank.Bad
        )

        entry.category = key
        entry.count = categoricalCounts[key]
        entry.score = score
        entry.rank = rank
        entries.append(entry)

    report = Report()
    report.entries = entries
    return report


# report = maslowClassificationReport(classifications)
# print("\n\n\nMASLOW REPORT---\n")
# print(report.to_dict())


def generateReport(classifications:Union[List[MaslowClassification],List[HerzbergClassification],List[McClellandClassification]],theory:MotivationTheory)->Report:
    report = None
    if theory == MotivationTheory.Maslow:
        report = maslowClassificationReport(classifications)
    elif theory == MotivationTheory.Herzberg:
        report = herzbergClassificationReport(classifications)
    elif theory == MotivationTheory.Mcclelland:
        report = mcclelandClassificationReport(classifications)

    return report

def addRecommendationsToReport(report:Report,
                               classifications:Union[List[MaslowClassification],List[HerzbergClassification],List[McClellandClassification]],
                               theory:MotivationTheory):
    concerningCategories:Union[List[MaslowCategory],List[HerzbergCategory]|List[McClellandCategory]] = []
    for r in report.entries:
        if r.rank in [ClassificationRank.Bad,ClassificationRank.Okay]:
            concerningCategories.append(r.category) if r.category.value != "Other" else ""
    print("concerningCateogires",concerningCategories)

    if concerningCategories == []:
        print("returning empty dict as recommendations",concerningCategories)
        return {}

    questions = {}
    suggestions:List[Dict[str,MaslowCategory|HerzbergCategory|McClellandCategory|QuestionSuggestion]] = []
    for cc in concerningCategories:
        questions[cc] = []

    for c in classifications:
        for category in c.classification:
            if category in concerningCategories:
                questions[category].append(c.question) if c.question not in questions else ""
    
    print("questions",questions)


    if theory==MotivationTheory.Maslow:
        for category in questions:
            suggestion=b.GetMaslowCategoricalJustification(questions=questions[category],category=category)

            suggestions.append(
                {
                    "category":category,
                    "suggestedQuestions":suggestion.suggestedQuestions
                }
            )
            
            for r in report.entries:
                if r.category == category:
                    r.justification = suggestion.recommendation
    if theory==MotivationTheory.Herzberg:
        for category in questions:
            suggestion=b.GetHerzbergCategoricalJustification(questions=questions[category],category=category)

            suggestions.append(
                {
                    "category":category,
                    "suggestedQuestions":suggestion.suggestedQuestions
                }
            )
            
            for r in report.entries:
                if r.category == category:
                    r.justification = suggestion.recommendation
    if theory==MotivationTheory.Mcclelland:
        for category in questions:
            suggestion=b.GetMcclellandCategoricalJustification(questions=questions[category],category=category)

            suggestions.append(
                {
                    "category":category,
                    "suggestedQuestions":suggestion.suggestedQuestions
                }
            )
            
            for r in report.entries:
                if r.category == category:
                    r.justification = suggestion.recommendation

    print("report with justification",report.to_dict())

    return suggestions



