import React, { useEffect, useState } from "react";
import { ClassificationRank, HerzbergCategory, MaslowCategory, McclellandCategory, rainbow, rainbowText, type SurveyTableData, type TableByCategoryData } from "../../types/frontend.types";
import { Link } from "react-router-dom";
import ListPopup, { type ListPopupEntry } from "../ui/ListPopup";



type props = {
  tableData:TableByCategoryData[];
  theory:typeof MaslowCategory|typeof HerzbergCategory|typeof McclellandCategory
  tailwind?:string;
}

export default function TableByCategory({tableData,theory,tailwind}:props){

  useEffect(()=>{
    for(const data of tableData){
      console.log(Object.keys(theory));
      console.log(data.category.split(" ").join(),Object.keys(theory).indexOf(data.category.split(" ").join()))

    }
  },[tableData])

  return (
    <>
    <div className={`overflow-x-auto relative flex flex-col justify-center items-center ${tailwind} `}>
    <div className="w-full flex flex-col my-4 justify-center items-center">
      <div className="text-3xl font-bold">Evaluation By Category</div>
      <div className="text-lg">{`This table ranks each category based on question classifications`}</div>
      </div>
      <table className="w-2/3 border-collapse border border-gray-200 shadow-md">
        <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
          <tr>
            <th className="py-3 px-6 text-left">Category</th>
            <th className="py-3 px-6 text-left"># Questions</th>
            <th className="py-3 px-6 text-left">Rank</th>
            <th className="py-3 px-6 text-left">Justification</th>
          </tr>
        </thead>
        <tbody className="">
          {tableData.map((data, index) => (
            <tr
              key={index}
              className={`border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer w-full ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"  
              }`}
            >
            <td className="py-3 px-6">
                  <div className="w-fit flex flex-row items-center justify-start p-2 border-2 border-gray-400 rounded-md">
                    <div className={`h-2 w-2 rounded-full   ${rainbow[Object.keys(theory).indexOf(data.category.toString().split(" ").join(""))]} mx-2`}></div>
                    <div className={` font-bold ${rainbowText[Object.keys(theory).indexOf(data.category.toString().split(" ").join(""))]}`}>
                    {data.category}
                    </div>
                  </div>
              </td>
              <td className="py-3 px-6">
                  {data.nQuestions}
              </td>
              <td className={`py-3 px-6 font-bold uppercase ${data.rank.toString()=="good"?"text-green-700":data.rank.toString()=="okay"?"text-blue-700":"text-red-700"} `}>
                  {data.rank}
              </td>
              <td className="py-3 px-6 w-[800px] overflow-x-scroll">
                  {data.justification}
              </td>
          </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
  );
};

