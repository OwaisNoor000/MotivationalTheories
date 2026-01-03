import { useParams } from "react-router-dom";
import { SurveyEditorWidget } from "../components/SurveyEditorWidget";
import Questionnaire from "../components/Questionnaire";

export default function QuestionannairePage(){
    const {surveyId} = useParams();

    return (
        <div className="h-full w-full">
            <Questionnaire surveyId={surveyId}></Questionnaire>
        </div>
    )
}