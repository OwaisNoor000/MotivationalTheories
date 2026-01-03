import React, { useEffect, useState } from "react";
import { HerzbergCategory, MaslowCategory, McclellandCategory, rainbow, rainbowText, type SurveyTableData, type TableByCategoryData, type TableByQuestionData } from "../../types/frontend.types";
import { Link } from "react-router-dom";
import ListPopup, { type ListPopupEntry } from "../ui/ListPopup";



type props = {
  tableData:TableByQuestionData[];
  theory:typeof MaslowCategory|typeof HerzbergCategory|typeof McclellandCategory;
  tailwind?:string;
}

export default function TableByQuestion({tableData,theory,tailwind}:props){
  console.log("test1")
  console.log(tableData)

  return (
    <>
    <div className={`overflow-x-auto relative w-full flex flex-col justify-center items-center ${tailwind} `}>
    <div className="my-4 flex-col flex justify-center items-center">
      <div className="text-3xl font-bold">Evaluation By Question</div>
      <div className="text-lg">{`This table displays each question and their categorical classifications`}</div>
    </div>
      <table className=" w-2/3 border-collapse border border-gray-200 shadow-md">
        <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
          <tr>
            <th className="py-3 px-6 text-left">Question</th>
            <th className="py-3 px-6 text-left">Question Type</th>
            <th className="py-3 px-6 text-left">Category</th>
            <th className="py-3 px-6 text-left">Page</th>
          </tr>
        </thead>
        <tbody className="">
          {tableData.map((data, index) => (
            <tr
              key={index}
              className={`border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              <td className="py-3 px-6 w-[800px] overflow-x-scroll">
                  {data.question}
              </td>
              <td className="py-3 px-6">
                    <div className="flex flex-row items-center justify-start p-2 border-2 border-gray-400 rounded-md">
                      <div className="h-2 w-2 rounded-full  bg-gray-400  mx-2"></div>
                      <div className={`font-bold text-gray-400`}>
                      {data.questionType}
                      </div>
                    </div>
                </td>
              <td className="py-3 px-6">
                    {data.category.map((category,index)=>(

                    <div className="flex flex-row items-center justify-start p-2 border-2 border-gray-400 rounded-md w-fit">
                      <div className={`h-2 w-2 rounded-full   ${rainbow[Object.keys(theory).indexOf(data.category.toString().split(" ").join(""))]} mx-2`}></div>
                      <div className={` mx-2 font-bold ${rainbowText[Object.keys(theory).indexOf(data.category.toString().split(" ").join(""))]}`}>
                      {category}
                      </div>
                    </div>
                    ))}
                </td>
              <td className="py-3 px-6 font-bold">
                  Page {data.page}
              </td>
          </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
  );
};

