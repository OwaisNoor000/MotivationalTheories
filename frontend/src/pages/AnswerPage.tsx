import { useParams } from "react-router-dom";
import { SurveyEditorWidget } from "../components/SurveyEditorWidget";
import Questionnaire from "../components/Questionnaire";
import Answer from "../components/Answer";

export default function AnswerPage(){
    const {surveyId,answerId} = useParams();

    return (
        <div className="h-full w-full">
            <Answer surveyId={surveyId} answerId={answerId}></Answer>
        </div>
    )
}