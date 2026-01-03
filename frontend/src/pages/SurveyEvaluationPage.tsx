import TableByCategory from "../components/tables/TableByCategory";
import SurveyEvaluationTable from "../components/tables/TableByCategory";
import Menu from "../components/ui/Menu";
import { ClassificationResponse, MaslowCategory, MotivationTheory, QuestionType, type SuggestionData, type TableByCategoryData, type TableByQuestionData } from "../types/frontend.types";
import MenuIcon from "../assets/menu-icon.svg";
import { t1, t2, t3 } from "./dummy/evaluation-data";
import TableByQuestion from "../components/tables/TableByQuestion";
import SuggestionTable from "../components/tables/SuggestionTable";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { generateSurveyClassificationReport } from "../hooks/requests";
import LoadingBar from "../components/ui/LoadingBar";



type PageProps = {
    theory:MotivationTheory,
    surveyId:string
}

export default function SurveyEvaluationPage(){
    const [selectIndex,setSelectIndex] = useState<number>(1);
    const {surveyId,theory} = useParams();
    const [t1Data,setT1Data] = useState<TableByCategoryData[]>([]);
    const [t2Data,setT2Data] = useState<TableByQuestionData[]>([]);
    const [t3Data,setT3Data] = useState<SuggestionData[]>([]);
    const [loadingPage,setLoadingPage] = useState<boolean>(true);

    useEffect(()=>{
        const request = async ()=>{
            setLoadingPage(true);
            let result:ClassificationResponse = await generateSurveyClassificationReport(surveyId,theory,true);
            console.log("result",result)
            let tableByCategoryData:TableByCategoryData[] = [];
            for(const entry of result.report){
                if (entry.category.toString() == "Other"){
                    continue
                }


                 let row:TableByCategoryData = {
                    "category":entry.category,
                    "nQuestions":entry.count,
                    "rank":entry.rank,
                    "justification":entry.justification==""?"Nothing to say":entry.justification
                } as TableByCategoryData;
                tableByCategoryData.push(row);
            }
            setT1Data(tableByCategoryData);

            let tableByQuestionData:TableByQuestionData[] = [];
            for(const question of result.classifications){
                let row:TableByQuestionData = {
                    "question":question.question,
                    "questionType":question.questionType,
                    "category":question.classification,
                    "page":question.page,
                } as TableByQuestionData;
                tableByQuestionData.push(row)
            }
            setT2Data(tableByQuestionData);

            let tableBySuggestion:SuggestionData[] = [];
            for(const suggestion of result.suggestions){
                for(const question of suggestion.suggestedQuestions ){
                    let row:SuggestionData = {
                        "question":question.question,
                        "category":suggestion.category,
                        "questionType":question.questionType.toLowerCase() as QuestionType
                    } 
                    tableBySuggestion.push(row); 
                }
                setT3Data(tableBySuggestion);
            }
            setLoadingPage(false);
        }


        request();
    },[surveyId,theory])

    return(
       <div className={`h-full w-full overflow-x-hidden`}>

            <Menu>
                <img src={MenuIcon} className="h-12 w-12 m-4"></img>
            </Menu>
            <div className="fixed  top-0 m-4 left-1/2 -translate-x-1/2 flex flex-row space-x-2 items-center z-20">
                <div className="text-xl mr-4">By:-</div>
                <div className="shadow-lg flex flex-row border border-gray-500 w-fit">
                    <div className={`bg-gray-200 text-gray-400 px-2 py-4 cursor-pointer ${selectIndex==1?"selectedTab":""}`}
                    onClick={()=>{setSelectIndex(1)}}>Category</div>
                    <div className={`bg-gray-200 text-gray-400 px-2 py-4 cursor-pointer ${selectIndex==2?"selectedTab":""}`}
                    onClick={()=>{setSelectIndex(2)}}>Question</div>
                    <div className={`bg-gray-200 text-gray-400 px-2 py-4 cursor-pointer ${selectIndex==3?"selectedTab":""}`}
                    onClick={()=>{setSelectIndex(3)}}>Suggestion</div>
                </div>
            </div>
            <center><div className="mb-4 mt-30 text-3xl underline"></div></center>
                {!loadingPage &&
                <div className="">
                    <TableByCategory tableData={t1Data} theory={MaslowCategory} tailwind={`${selectIndex==1?"":"hidden"}`}/>
                    <TableByQuestion tableData={t2Data} theory={MaslowCategory} tailwind={`${selectIndex==2?"":"hidden"}`}/>
                    <SuggestionTable surveyId={surveyId} tableData={t3Data} theory={MaslowCategory} tailwind={`${selectIndex==3?"":"hidden"}`}/>
                </div>
                }
                {loadingPage && <LoadingBar/>}
       </div> 
    )
}