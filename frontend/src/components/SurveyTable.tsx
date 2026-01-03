import React, { useEffect, useState } from "react";
import type { SurveyTableData } from "../types/frontend.types";
import { Link } from "react-router-dom";
import ListPopup, { type ListPopupEntry } from "./ui/ListPopup";


interface Props {
  surveys: SurveyTableData[];
}

const SurveyTable: React.FC<Props> = ({ surveys}) => {

  
  const [answers,setAnswers] = useState<ListPopupEntry[][]>([]);
  const [answer,setAnswer] = useState<ListPopupEntry[]>([]);
  const [answersVisible,setAnswersVisible] = useState<boolean>(false);
  
  useEffect(()=>{
    const answers:ListPopupEntry[][] = [];
    let i=0;

    for(const survey of surveys){
      if(survey.answerIds==undefined || survey.answerIds==null){
        answers.push([]);
        continue;
      }

      let record:ListPopupEntry[] = [];
      for(const answerId of survey.answerIds){
        let url = `/view-survey-answer/${survey.name}/${answerId}`
        record.push({"labelName":answerId,"pagePath":url});
      }
      answers.push(record);
      i++;
    }

    setAnswers(answers);
  },[surveys]);


  const showAnswers = (index:number)=>{
    setAnswer(answers[index]);
    setAnswersVisible(true);
  }


  return (
    <div className="overflow-x-auto relative">
      <ListPopup entries={answer} setVisible={setAnswersVisible} title="Survey answers" visible={answersVisible}/>
      <table className="min-w-full border-collapse border border-gray-200 shadow-md">
        <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
          <tr>
            <th className="py-3 px-6 text-left">Survey Name</th>
            <th className="py-3 px-6 text-left"># Questions</th>
            <th className="py-3 px-6 text-left"># Answers</th>
            <th className="py-3 px-6 text-left">Author</th>
            <th className="py-3 px-6 text-left">Action</th>
          </tr>
        </thead>
        <tbody className="">
          {surveys.map((survey, index) => (
            <tr
              key={index}
              className={`border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
            <td className="py-3 px-6">
                  {survey.name}
              </td>
              <td className="py-3 px-6">
                  {survey.questions}
              </td>
              <td className="py-3 px-6">
                  {survey.answerIds==undefined?0:survey.answerIds.length}
              </td>
              <td className="py-3 px-6">
                  Owais
              </td>
              <td className="py-3 px-6">
                  <button className="px-2 rounded-sm font-bold border bg-orange-400 mx-2 cursor-pointer hover:scale-110">
                    <Link to={`/edit-survey/${survey.name}`} className="w-full block ">
                      Edit  
                    </Link>
                  </button>
                <button className="px-2 rounded-sm font-bold border bg-blue-400 mx-2 cursor-pointer hover:scale-110">
                  
                  <Link to={`/fillout-survey/${survey.name}`} className="w-full block ">
                    Fill out  
                  </Link>
                </button>
                <button className="px-2 rounded-sm font-bold border bg-pink-400 mx-2 cursor-pointer hover:scale-110" onClick={()=>{showAnswers(index)}}>
                    ↓ View Answers ↓
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SurveyTable;
