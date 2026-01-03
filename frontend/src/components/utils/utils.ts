import { QuestionType, type SuggestionQuestionWithCategory } from "../../types/frontend.types";

export function convertQuestionsToSurveyJson(questions:SuggestionQuestionWithCategory[],originalJson:any):any{
   let suggestionsPage = {"name":"AI Suggestions","title":"AI Suggestions"}
   let elements = [];
   for (const q of questions){
    let randomIndex:number = Math.floor(Math.random()*(1000000)+1)
    let element = {
        "type":q.questionType,
        "name":`question${randomIndex}`,
        "title":q.question,
        "showTitle":"true"
    }

    if(q.questionType != QuestionType.text){
        element["choices"] = [{"value":"item1","text":"item1"},{"value":"item2","text":"item2"}]
    }

    elements.push(element);
   }
    suggestionsPage["elements"] = elements
    console.log("og json",originalJson,typeof originalJson)
    let og = JSON.parse(originalJson)
    og.pages.push(suggestionsPage)
    console.log(JSON.stringify(og))
    return JSON.stringify(og);
}