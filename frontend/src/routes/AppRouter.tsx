import { Route, Routes } from "react-router-dom";
import { SurveyCreatorWidget } from "../components/SurveyCreatorWidget";
import { HomePage } from "../pages/HomePage";
import SurveySelectorPage from "../pages/SurveySelectorPage";
import { SurveyEditorWidget } from "../components/SurveyEditorWidget";
import SurveyEditPage from "../pages/SurveyEditPage";
import QuestionannairePage from "../pages/QuestionnairePage";
import AnswerPage from "../pages/AnswerPage";
import TheoryPage from "../pages/TheoryPage";
import SurveyEvaluationPage from "../pages/SurveyEvaluationPage";
import SurveyEvaluationEditPage from "../pages/SurveyEvaluationEditPage";
import IndividualReport from "../components/IndividualReport";
import TheoryAnswerPage from "../pages/TheoryAnswerPage";
import EditIndividualReport from "../components/EditIndividualReport";
import ComparisonReportPage from "../pages/ComparisonReportPage";

export default function AppRouter(){
    return (
        <Routes>
            <Route path="/" element={<HomePage/>}></Route>
            <Route path="/create-survey" element={<SurveyCreatorWidget/>}></Route>
            <Route path="/view-survey" element={<SurveySelectorPage/>}></Route>
            <Route path="/edit-survey/:surveyId" element={<SurveyEditPage/>}></Route>
            <Route path="/fillout-survey/:surveyId" element={<QuestionannairePage/>}></Route>
            <Route path="/view-survey-answer/:surveyId/:answerId" element={<AnswerPage/>}></Route>
            <Route path="/theory" element={<TheoryPage/>}></Route>
            <Route path="/survey-evaluation/:surveyId/:theory" element={<SurveyEvaluationPage/>}></Route>
            <Route path="/view-survey-evaluation/:surveyId/:theory" element={<SurveyEvaluationEditPage/>}></Route>
            <Route path="/report/:surveyId/:answerId/:theoryInput" element={<IndividualReport/>}></Route>
            <Route path="/report/record/:surveyId/:answerId/:theoryInput" element={<EditIndividualReport/>}></Route>
            <Route path="/theory/answer" element={<TheoryAnswerPage/>}></Route>
            <Route path="/report/comparison/:surveyId" element={<ComparisonReportPage/>}/>
        </Routes>
    )
}