import { useLocation, useParams } from "react-router-dom";
import { SurveyEditorWidget } from "../components/SurveyEditorWidget";
import { SuggestionQuestionWithCategory } from "../types/frontend.types";

export default function SurveyEditPage(){
    const {surveyId} = useParams();
    const location = useLocation();
    const data = location.state;
    let suggestions = undefined;
    if(data){
        suggestions = data["suggestions"];
    }

    

    return (
        <div className="h-full w-full">
            {
                (suggestions==undefined || suggestions==null) &&
                <SurveyEditorWidget surveyId={surveyId}></SurveyEditorWidget>
            }

            {
                suggestions!=undefined && suggestions!=null && 
                <SurveyEditorWidget surveyId={surveyId} additionalQuestions={suggestions}></SurveyEditorWidget>
            }
        </div>
    )
}