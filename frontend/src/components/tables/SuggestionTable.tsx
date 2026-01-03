import  { useEffect, useState } from "react";
import { HerzbergCategory, MaslowCategory, McclellandCategory, QuestionType, rainbow, rainbowText, SuggestionQuestionWithCategory, type SuggestionData, type SurveyTableData, type TableByCategoryData, type TableByQuestionData } from "../../types/frontend.types";
import PlusIcon from "../../assets/plus.svg";
import { Link } from "react-router-dom";



type props = {
  tableData:SuggestionData[];
  theory:typeof MaslowCategory|typeof HerzbergCategory|typeof McclellandCategory;
  tailwind?:string;
  surveyId:string;
}



export default function SuggestionTable({tableData,theory,tailwind,surveyId}:props){

  const [selectedRowIds,setSelectedRowIds] = useState<number[]>([]);
  const [suggestions,setSuggestions] = useState<SuggestionQuestionWithCategory[]>();

  // const addToSurveyData = (question:string,questionType:QuestionType,category:HerzbergCategory|MaslowCategory|McclellandCategory)=>{
  //     let record = new SuggestionQuestionWithCategory();
  //     record.question = question;
  //     record.questionType = questionType;
  //     record.category = category;

  //     setSurveyDataToAdd([...surveyDataToAdd,record]);
      
  // }

    const toggleSelection = (key:number)=>{
      if(selectedRowIds.includes(key)){
        let newArr = selectedRowIds.filter((item)=>item!=key)
        setSelectedRowIds(newArr);
      }else{
        setSelectedRowIds([...selectedRowIds,key])
      }
    }



  useEffect(()=>{

    const addQuestionsToSurvey = ()=>{
      let additionalQuestions:SuggestionQuestionWithCategory[] = [];
      for(const key of selectedRowIds){
        let record = new SuggestionQuestionWithCategory();
        record.category = tableData[key].category;
        record.question = tableData[key].question;
        record.questionType = tableData[key].questionType;
        additionalQuestions.push(record);
      }
      
      setSuggestions(additionalQuestions);
    }

    addQuestionsToSurvey();

  },[selectedRowIds]);

  return (
    <div className={`overflow-x-auto w-full flex flex-col justify-center items-center ${tailwind} `}>

    <div className="w-full flex flex-col my-4 justify-center items-center">
      <div className="text-3xl font-bold mb-2">Suggestions</div>
      <div className="text-lg flex flex-col justify-center items-center">
        <span>These are AI suggestions for further improve your survey score.</span>
      </div>
      </div>
      {
        selectedRowIds.length>0 &&
        <Link to={`/edit-survey/${surveyId}`}
        state={{suggestions}}>
      <button 
        className={`border-3 rounded-sm px-4 py-2 absolute top-0 right-0 m-4 ${selectedRowIds.length>0?"border-[#19B394] text-[#19B394] cursor-pointer":"border-gray-400 text-gray-400"}`}
        >
        Add Suggestions To Survey
      </button>
      </Link>}
      <table className=" w-2/3 border-collapse border border-gray-200 shadow-md">
        <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
          <tr>
            <th className="py-3 px-6 text-left">Question</th>
            <th className="py-3 px-6 text-left">Category</th>
            <th className="py-3 px-6 text-left">Question Type</th>
            <th className="py-3 px-6 text-left">Action</th>
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
                    <div className="flex flex-row items-center justify-start p-2 border-2 border-gray-400 rounded-md w-fit">
                      <div className={`h-2 w-2 rounded-full   ${rainbow[Object.keys(theory).indexOf(data.category.toString().split(" ").join(""))]} mx-2`}></div>
                      <div className={` mx-2 font-bold ${rainbowText[Object.keys(theory).indexOf(data.category.toString().split(" ").join(""))]}`}>
                      {data.category}
                      </div>
                    </div>
                </td>

              <td className="py-3 px-6">
                  {data.questionType}
              </td>
              <td className="py-3 px-6">
                <button className="border-[#19B394] border-2 text-[#19B394] hover:bg-[#19B394] hover:text-white cursor-pointer"
                onClick={()=>{toggleSelection(index)}}>
                  { !selectedRowIds.includes(index) &&  <svg className="h-8 w-8" width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 12H20M12 4V20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>}

                  {selectedRowIds.includes(index) && <svg className="h-8 w-8" width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <title/>
                  <g id="Complete"><g id="tick">
                  <polyline fill="none" points="3.7 14.3 9.6 19 20.3 5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                  </g></g>
                  </svg>}
                </button>
              </td>
          </tr>
          ))}
        </tbody>
      </table>
      {
        (!suggestions)  &&
        <div className="w-fill my-6 flex flex-row justify-center items-center text-lg font-bold">Suggestions are only generated when a category with ranking <span className="text-red-500 whitespace-pre-wrap"> Bad </span> or <span className="text-blue-500 whitespace-pre-wrap"> Okay </span> exists</div>
      }
    </div>
  );
};

