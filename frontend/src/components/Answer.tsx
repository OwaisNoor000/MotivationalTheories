import { useEffect, useState } from "react";
import { getSurveyAnswer, getSurveyDataById } from "../hooks/requests";
import { Model, Survey } from "survey-react-ui";

type AnswerProps = {
    surveyId:string;
    answerId:string;
}

export default function Answer({surveyId,answerId}:AnswerProps){
    const [surveyModel,setSurveyModel] = useState<Model>();
    const [answer,setAnswer] = useState();

    useEffect(()=>{
        const request = async()=>{
            const questions = await getSurveyDataById(surveyId);
            const answer = await getSurveyAnswer(surveyId,answerId);
            console.log(questions)
            console.log(answer)
            let model = new Model(questions);
            model.readOnly = true;
            model.data = answer
            setSurveyModel(model);
        }

        request();
    },[surveyId,answerId]);



    return (
        <>
        {surveyModel!=null &&
            <Survey model={surveyModel}></Survey>
        }
        <br></br>
        </>
    )



}