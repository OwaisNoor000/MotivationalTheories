import React, { useEffect, useState } from "react";
import { HerzbergCategory, MaslowCategory, McclellandCategory, rainbow, rainbowText, type SurveyTableData, type TableByCategoryData, type TableByQuestionData } from "../../types/frontend.types";
import { Link } from "react-router-dom";
import ListPopup, { type ListPopupEntry } from "../ui/ListPopup";
import type { TableByAnswerData } from "../../types/report.types";



type props = {
  tableData:TableByAnswerData[];
  categories:typeof MaslowCategory|typeof HerzbergCategory|typeof McclellandCategory;
  tailwind?:string;
}

export default function TableByAnswer({tableData,categories: theory,tailwind}:props){


  return (
    <>
    <div className={`overflow-x-auto relative w-full flex flex-col justify-center items-center ${tailwind} mt-30`}>
    <div className="my-4 flex-col flex justify-center items-center">
      <div className="text-3xl font-bold">Evaluation By Answer</div>
      <div className="text-lg">{`This table displays each answer and their categorical classifications`}</div>
    </div>
      <table className=" w-2/3 border-collapse border border-gray-200 shadow-md">
        <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
          <tr>
            <th className="py-3 px-6 text-left">Question</th>
            <th className="py-3 px-6 text-left">Category</th>
            <th className="py-3 px-6 text-left">Score</th>
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
              <td className="py-3 px-6 w-[600px] max-h-[100px] overflow-x-scroll overflow-y-scroll flex flex-col">
                  <span className="font-bold mb-2">{data.question}</span>
                  <span>{data.answer}</span>
              </td>
              <td className="py-3 px-6">
                    {data.category.map((value,index)=>(

                      <div className="mb-1 flex flex-row items-center justify-start p-2 border-2 border-gray-400 rounded-md w-fit">
                        <div className={`h-2 w-2 rounded-full   ${rainbow[Object.keys(theory).indexOf(data.category.toString().split(" ").join(""))]} mx-2`}></div>
                        <div className={` mx-2 font-bold ${rainbowText[Object.keys(theory).indexOf(data.category.toString().split(" ").join(""))]}`}>
                        {value}
                        </div>
                      </div>
                    ))}
                </td>
              <td className="py-3 px-6 flex flex-row space-x-4 items-end">
                    <div className={`h-10 w-10 bg-white border-10 box-content rounded-full `}
                    style={{mask:`linear-gradient(red 0 0) padding-box,conic-gradient(red var(--p, ${Math.floor(data.score/5*100)}%), transparent 0%) border-box`,
                    borderColor:`${Math.floor(data.score/5*100)>80?"lime":Math.floor(data.score/5*100)>50?"yellow":"red"}`}}></div>
                    <div className="mb-2">
                        <span className="text-3xl font-bold">{data.score}</span>
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

