import React, { useEffect, useState } from "react";
import { ClassificationRank, HerzbergCategory, MaslowCategory, McclellandCategory, rainbow, rainbowText, type SurveyTableData, type TableByCategoryData } from "../../types/frontend.types";
import type { AnswerScores, DiagramTableData } from "../../types/report.types";
import Trophy from "../../assets/prize.svg";

export let maslowDiagramSampleData:DiagramTableData[] = [
  {"category":MaslowCategory.Belongingness,"score":4.5},
  {"category":MaslowCategory.Esteem,"score":3.1},
  {"category":MaslowCategory.Physiological,"score":1.2},
  {"category":MaslowCategory.Safety,"score":4.4},
  {"category":MaslowCategory.SelfActualization,"score":1.1},
]

type props = {
  tableData:AnswerScores[];
  theory:typeof MaslowCategory|typeof HerzbergCategory|typeof McclellandCategory
  tailwind?:string;
}

export default function Diagram({tableData,theory,tailwind}:props){
  const [winner,setWinner] = useState<number>();

  useEffect(()=>{
      let winningIndex = 0;
      let currentIndex = 0;
      for(const row of tableData){
        if (row.score>tableData[winningIndex].score){
          winningIndex = currentIndex;
        }
        currentIndex++;
    }

      console.log("currentIndex",winningIndex)
      setWinner(winningIndex);
  },[tableData])

  return (
    <>
    <div className={`overflow-x-auto relative flex flex-col justify-center items-center ${tailwind}`}>
      <table className="w-2/3 border-collapse border border-gray-200 shadow-md">
        <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
          <tr>
            <th className="py-3 px-6 text-left">Category</th>
            <th className="py-3 px-6 text-left"></th>
            <th className="py-3 px-6 text-left">Score</th>
          </tr>
        </thead>
        <tbody className="">
          {tableData.map((data, index) => (
            <tr
              key={index}
              className={`border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer w-full ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"  
              }`}
              style={{border:index==winner?"2px solid green":""}}
            >
            <td className="py-3 px-6">
                  <div className=" w-fit flex flex-row items-center justify-start p-2 border-2 border-gray-400 rounded-md">
                    <div className={`h-2 w-2 rounded-full  border-red-500  ${rainbow[Object.keys(theory).indexOf(data.category.toString().split(" ").join(""))]} mx-2`}></div>
                    <div className={` font-bold ${rainbowText[Object.keys(theory).indexOf(data.category.toString().split(" ").join(""))]}`}>
                    {data.category}
                    </div>
                  </div>
              </td>
              <td>
                {
                  index==winner &&
                  <img src={Trophy} className="h-10 w-10"/>
                }

                {
                  (index!=winner && data.score>4.0) &&
                  <img src={Trophy} className="h-6 w-6"/>
                }
              </td>
              <td className="py-3 px-6 flex flex-row space-x-4 items-end">
                    <div className={`h-10 w-10 bg-white border-10 box-content rounded-full `}
                    style={{mask:`linear-gradient(red 0 0) padding-box,conic-gradient(red var(--p, ${Math.floor(data.score/5*100)}%), transparent 0%) border-box`,
                    borderColor:`${Math.floor(data.score/5*100)>80?"lime":Math.floor(data.score/5*100)>50?"yellow":"red"}`}}></div>
                    <div className="mb-2">
                        <span className="text-3xl font-bold">{Math.round(data.score*10)/10}</span>
                        <span className="text-lg text-gray-600 whitespace-pre-wrap"> / 5</span>
                    </div>
              </td>
          </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
  );
};

