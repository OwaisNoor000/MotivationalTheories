import { useEffect, useState } from "react"
import Menu from "./ui/Menu";
import MenuIcon from "../assets/menu-icon.svg";
import Diagram, { maslowDiagramSampleData } from "./reports/Diagram";
import { HerzbergCategory, MaslowCategory, McclellandCategory, MotivationTheory } from "../types/frontend.types";
import { getAnswerEvaluations } from "../hooks/requests";
import { AnswerRankResponse, AnswerScores, TableByAnswerData } from "../types/report.types";
import TableByAnswer from "./reports/TableByAnswer";
import { useParams } from "react-router-dom";
import LoadingBar from "./ui/LoadingBar";

type IndividualReportProps = {
    surveyId:string;
    answerId:string;
    theory:MotivationTheory
}

export default function IndividualReport(){ 
    const {surveyId,answerId,theoryInput} = useParams();
    console.log("theoryInput",theoryInput)
    const theory = theoryInput as MotivationTheory;
    const [selectIndex,setSelectIndex] = useState<number>(1); 
    const [evaluations,setEvaluations] = useState<TableByAnswerData[]>([]);
    const [report,setReport] = useState<AnswerScores[]>([]);
    const [avgScore,setAvgScore] = useState<number>(0.0);
    const [loading,setLoading] = useState<boolean>(false);

   useEffect(()=>{
    const request = async ()=>{
        setLoading(true);
        let answerEvaluation:AnswerRankResponse = await getAnswerEvaluations(surveyId,answerId,theory);
        setEvaluations(answerEvaluation.table);
        setReport(answerEvaluation.report);
        setAvgScore(Math.round(answerEvaluation.averageScore*10)/10)
        setLoading(false);
    }
    request();
   },[surveyId,answerId,theory])
    
    return (

        <div className="overflow-x-hidden w-full">

            <Menu>
                <img src={MenuIcon} className="h-12 w-12 m-4"></img>
            </Menu>
            <div className="absolute my-4 mr-10 top-0 right-0 flex flex-col px-6 py-2 shadow-xl border-gray-300 border">
                <div className="text-gray-500 text-xl my-4">Average Score</div>
                <div className="flex flex-row space-x-4 items-end mb-2">
                    <div className="h-14 w-14 bg-white border-10 box-content border-green-500 rounded-full "
                    style={{mask:`linear-gradient(red 0 0) padding-box,conic-gradient(red var(--p, ${avgScore/5*100}%), transparent 0%) border-box`}}></div>
                    <div className="mb-2">
                        <span className="text-5xl font-bold">{avgScore}</span>
                        <span className="text-lg text-gray-600 whitespace-pre-wrap"> / 5</span>
                    </div>
                </div>
            </div>
            <div className="fixed  top-0 m-4 left-1/2 -translate-x-1/2 flex flex-row space-x-2 items-center z-20">
                <div className="text-xl mr-4">Report :-</div>
                <div className="flex flex-row border border-gray-500 w-fit rounded-xs">
                    <div className={`bg-gray-200 text-gray-400 px-2 py-4 cursor-pointer ${selectIndex==1?"selectedTab":""}`}
                    onClick={()=>{setSelectIndex(1)}}
                    >Motivational Theory</div>
                    <div className={`bg-gray-200 text-gray-400 px-2 py-4 cursor-pointer ${selectIndex==2?"selectedTab":""}`}
                    onClick={()=>{setSelectIndex(2)}}
                    >Score by Answer</div>
                </div>
            </div>

            {selectIndex==1 && !loading && <Diagram tableData={report} theory={MaslowCategory} tailwind="my-50"/>}
            {selectIndex==2 && !loading && <TableByAnswer tableData={evaluations} categories={theory==MotivationTheory.Maslow?MaslowCategory:theory==MotivationTheory.Herzberg?HerzbergCategory:McclellandCategory}/>}
            <div className="mt-30">
                {loading && <LoadingBar/>}
            </div>
        </div>
    )
}