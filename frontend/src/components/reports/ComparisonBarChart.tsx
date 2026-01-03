import { useEffect, useState } from "react";
import { BarCategoryData, type BarData } from "../../types/report.types";
import { MaslowCategory } from "../../types/frontend.types";

type ComponentProps = {
    mouseX:number;
    mouseY:number;
    chartData:BarData[];
}

export let charDataExample:BarData[] = [
    {
        "label":"owais",
        "averageScore":4.5,
        "categoricalScores":[
            {
                "score":4.5,
                "category":MaslowCategory.Belongingness
            },
            {
                "score":4.5,
                "category":MaslowCategory.Esteem
            },
            {
                "score":4.5,
                "category":MaslowCategory.Safety
            },
        ]
    },
    {
        "label":"owais",
        "averageScore":5.0,
        "categoricalScores":[
            {
                "score":5.0,
                "category":MaslowCategory.Belongingness
            },
            {
                "score":5.0,
                "category":MaslowCategory.Esteem
            },
            {
                "score":5.0,
                "category":MaslowCategory.Safety
            },
        ]
    },
    {
        "label":"owais",
        "averageScore":3.7,
        "categoricalScores":[
            {
                "score":3.5,
                "category":MaslowCategory.Belongingness
            },
            {
                "score":3.5,
                "category":MaslowCategory.Esteem
            },
            {
                "score":3.5,
                "category":MaslowCategory.Safety
            },
        ]
    },
    {
        "label":"owais",
        "averageScore":1.2,
        "categoricalScores":[
            {
                "score":3.5,
                "category":MaslowCategory.Belongingness
            },
            {
                "score":3.5,
                "category":MaslowCategory.Esteem
            },
            {
                "score":3.5,
                "category":MaslowCategory.Safety
            },
        ]
    },
    {
        "label":"owais",
        "averageScore":2.8,
        "categoricalScores":[
            {
                "score":3.5,
                "category":MaslowCategory.Belongingness
            },
            {
                "score":3.5,
                "category":MaslowCategory.Esteem
            },
            {
                "score":3.5,
                "category":MaslowCategory.Safety
            },
        ]
    },
]

export default function ComparisonBarChart({mouseX,mouseY,chartData}:ComponentProps){
    const [scoreBreakdown,setScoreBreakdown] = useState<BarCategoryData[]>([]);
    const [hoveredBarIndex,setHoveredBarIndex] = useState<number>(-1);

    useEffect(()=>{
        if(hoveredBarIndex==-1){
            setScoreBreakdown([]);
        }else{
            console.log("chartData",chartData[hoveredBarIndex].categoricalScores)
            setScoreBreakdown(chartData[hoveredBarIndex].categoricalScores);
        }
    },[hoveredBarIndex])

    return (
        <div className="flex flex-row space-x-4">
            <div className="p-5 z-20 bg-black text-white h-fit absolute" id="insights-box" style={{left:mouseX+20,top:mouseY-20,display:`${hoveredBarIndex==-1?"none":"block"}`}}>
                {
                scoreBreakdown.map((value,index)=>(
                    <span>
                        <span>{`${value.category}`}</span>=<span>{Math.round(value.score*10)/10}</span>
                        <br></br>
                    </span>
                ))
                }
            </div>

            <div className="flex flex-col justify-between h-[500px] ">
                <span className="flex flex-row items-center">
                    <span>5</span>
                    <div className="h-[2px] w-[20px] bg-gray-400 absolute translate-x-4"></div>
                </span>
                <span className="flex flex-row items-center">
                    <span>4</span>
                    <div className="h-[2px] w-[20px] bg-gray-400 absolute translate-x-4"></div>
                </span>
                <span className="flex flex-row items-center">
                    <span>3</span>
                    <div className="h-[2px] w-[20px] bg-gray-400 absolute translate-x-4"></div>
                </span>
                <span className="flex flex-row items-center">
                    <span>2</span>
                    <div className="h-[2px] w-[20px] bg-gray-400 absolute translate-x-4"></div>
                </span>
                <span className="flex flex-row items-center">
                    <span>1</span>
                    <div className="h-[2px] w-[20px] bg-gray-400 absolute translate-x-4"></div>
                </span>
                <span className="flex flex-row items-center">
                   <span>0</span>
                    <div className="h-[2px] w-[20px] bg-gray-400 absolute translate-x-4"></div>
                </span>
            </div>
            <div className="h-[500px] w-[1000px] max-w-[1200px] border-gray-400 border-2 border-l-3 border-r-3 rounded-md flex flex-row justify-around">
                <div className="w-full px-4 pt-2 flex flex-row space-x-4">
                    {
                        chartData.map((data,index)=>(
                            <div className="flex-1 h-full  relative" >
                                <div onMouseEnter={()=>{setHoveredBarIndex(index)}} onMouseLeave={()=>{setHoveredBarIndex(-1)}}
                                className="cursor-pointer w-full bg-[#19B394] bottom-0 absolute border-black border-2" style={{height:`${data.averageScore/5*100}%`}}></div>
                                <span className="text-sm absolute -bottom-10 left-1/2 -translate-x-1/2 ">{data.label}</span>
                            </div> 
                        ))
                    }
                </div>
            </div>
        </div>
    )
}