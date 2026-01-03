import { useCallback, useEffect, useState } from "react"
import { Model, Survey } from "survey-react-ui"
import { getSurveyDataById, saveSurveyAnswer } from "../hooks/requests";

type QuestionnaireProps = {
    surveyId:string
}

export default function Questionnaire({surveyId}:QuestionnaireProps){
    const [surveyModel,setSurveyModel] = useState<Model>(null);

    useEffect(()=>{
        const request = async()=>{
            let surveyData = await getSurveyDataById(surveyId);
            setSurveyModel(new Model(surveyData));
        }
        request();
    },[surveyId]);

    const saveAnswer = useCallback((survey:Model)=>{
        const request = async()=>{
            let answerId:string = "";
            const fileName = prompt("Give this survey answer instance a name",undefined);
            if(fileName==undefined || fileName==null){
                alert("answer instance name cannot be null");
                return;
            }else{
                answerId = fileName;
            }
            await saveSurveyAnswer(surveyId,answerId,survey.data);

        }
        request();
    },[surveyId]);

    useEffect(() => {
        if (!surveyModel) return;

        surveyModel.onComplete.add(saveAnswer);

        return () => {
            surveyModel.onComplete.remove(saveAnswer);
        };
    }, [surveyModel, saveAnswer]);




    return (
        <>
        {surveyModel!=null &&
            <Survey model={surveyModel}></Survey>
        }
        <br></br>
        </>
    )
}