
import { useEffect, useState } from "react";
import MenuIcon from "../assets/menu-icon.svg";
import Menu from "../components/ui/Menu";
import ComparisonBarChart, { charDataExample } from "../components/reports/ComparisonBarChart";
import { useParams } from "react-router-dom";
import { getBarChartData, getCriteriaReportBatch } from "../hooks/requests";
import { McclellandCategory, MotivationTheory } from "../types/frontend.types";
import { BarData, type AnswerRankBatch } from "../types/report.types";





export default function ComparisonReportPage(){
    const [selectIndex,setSelectIndex] = useState<number>(1);
    const [mousePosition,setMousePosition] = useState<number[]>([]);
    const {surveyId} = useParams();
    
    const [maslowBarData,setMaslowBarData] = useState<BarData[]>([]);
    const [herzbergBarData,setHerzbergBarData] = useState<BarData[]>([]);
    const [mclellandBarData,setMclellandBarData] = useState<BarData[]>([]);


    useEffect(()=>{
        const request  = async ()=>{
            let maslowData:BarData[] = await getBarChartData(surveyId,MotivationTheory.Maslow);
            setMaslowBarData(maslowData);
            let herzbergData:BarData[] = await getBarChartData(surveyId,MotivationTheory.Herzberg);
            setHerzbergBarData(herzbergData);
            let mcclellandData:BarData[] = await getBarChartData(surveyId,MotivationTheory.Mcclelland);
            setMclellandBarData(mcclellandData);
        }
        request();
    },[])

    return(    
    <div className="h-screen overflow-y-hidden " onMouseMove={(event)=>{setMousePosition([event.clientX,event.clientY])}}>
        <Menu>
            <img src={MenuIcon} className="h-12 w-12 m-4"></img>
        </Menu>
            <div className="fixed  top-0 m-4 left-1/2 -translate-x-1/2 flex flex-row space-x-2 items-center z-20">
                <div className="text-xl mr-4">Report :-</div>
                <div className="flex flex-row border border-gray-500 w-fit rounded-xs">
                    <div className={`bg-gray-200 text-gray-400 px-2 py-4 cursor-pointer ${selectIndex==1?"selectedTab":""}`}
                    onClick={()=>{setSelectIndex(1)}}
                    >Maslow</div>
                    <div className={`bg-gray-200 text-gray-400 px-2 py-4 cursor-pointer ${selectIndex==2?"selectedTab":""}`}
                    onClick={()=>{setSelectIndex(2)}}
                    >Herzberg</div>
                    <div className={`bg-gray-200 text-gray-400 px-2 py-4 cursor-pointer ${selectIndex==3?"selectedTab":""}`}
                    onClick={()=>{setSelectIndex(3)}}
                    >McClelland</div>
                </div>
            </div>
        
        <div className="flex flex-row justify-center items-center mt-30">
            {selectIndex==1 && <ComparisonBarChart mouseX={mousePosition[0]} mouseY={mousePosition[1]} chartData={maslowBarData}/>}
            {selectIndex==2 && <ComparisonBarChart mouseX={mousePosition[0]} mouseY={mousePosition[1]} chartData={herzbergBarData}/>}
            {selectIndex==3 && <ComparisonBarChart mouseX={mousePosition[0]} mouseY={mousePosition[1]} chartData={mclellandBarData}/>}
        </div>
    </div>
    )
}