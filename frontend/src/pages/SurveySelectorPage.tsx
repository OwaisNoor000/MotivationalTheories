import Menu from "../components/ui/Menu";
import MenuIcon from "../assets/menu-icon.svg";
import SurveyTable  from "../components/SurveyTable";
import { useEffect, useState } from "react";
import dotenv from "dotenv";
import { getSurveyAnswerIds, getSurveys } from "../hooks/requests";
import type { SurveyTableData } from "../types/frontend.types";


const surveyData0 = [
  { name: "Customer Feedback", questions: 5, author: "Owais" },
  { name: "Employee Engagement", questions: 10, author: "Stacy" },
  { name: "Market Research", questions: 7, author: "Farhan" },
];

export default function SurveySelectorPage(){
    const [surveyData,setSurveyData] = useState<SurveyTableData[]>([]);

    useEffect(()=>{
        const request = async ()=>{
            let metadata =  await getSurveys();
            for(const mt of metadata){
                const answerMetadata = await getSurveyAnswerIds(mt.name);
                mt.answerIds = answerMetadata.answerIds;
            }
            setSurveyData(metadata);
        }
        request();
    },[]);


return(
    <div className="h-full w-full">
            <Menu>
                <img src={MenuIcon} className="h-12 w-12 m-4"></img>
            </Menu>
            <div className="mt-20">
                <SurveyTable surveys={surveyData} />
            </div>

    </div>
    )
}