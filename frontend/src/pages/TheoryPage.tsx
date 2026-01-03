import { useEffect, useState } from "react"
import AiStars from "../assets/ai-stars.svg"
import { MotivationTheory, SurveyTableData } from "../types/frontend.types";
import { getSurveys } from "../hooks/requests";
import Menu from "../components/ui/Menu";
import MenuIcon from "../assets/menu-icon.svg";
import { Link } from "react-router-dom";
import PlusIcon from "../assets/plus.svg";

let theoryLabels = [
    "Maslow's theory of needs",
    "Herzberg's two factor theory",
    "Mccleland's theory of needs",
];

let theoryDescriptions = [
    "Maslow’s hierarchy of needs is a psychological theory proposing that human motivation progresses through levels: physiological needs, safety, love and belonging, esteem, and self-actualization. Lower basic needs must be reasonably satisfied before individuals are motivated to pursue higher-level psychological growth and personal fulfillment.",
    "Herzberg’s theory distinguishes between hygiene factors and motivators. Hygiene factors such as salary, company policy, and working conditions prevent dissatisfaction but do not motivate. True motivation comes from motivators like achievement, recognition, responsibility, and opportunities for personal growth.",
    "McClelland’s theory states that motivation is driven by three learned needs: achievement, affiliation, and power. Individuals are motivated differently depending on which need dominates. These needs influence behavior, leadership style, work preferences, and performance in organizational and social settings."

];

let backgroundClasses = [
    "maslow-bg",
    "herzberg-bg",
    "mclleland-bg",

]

export default function TheoryPage(){
    const [surveyIds,setSurveyIds] = useState<string[]>([]);  
    const [theoryIndex,setTheoryIndex] = useState<number>(0);
    const [selectedTheory,setSelectedTheory] = useState<MotivationTheory>(MotivationTheory.Maslow);
    const [selectedSurveyId,setSelectedSurveyId] = useState<string>();

    useEffect(()=>{
        console.log(theoryIndex)
        if(theoryIndex==0){
            setSelectedTheory(MotivationTheory.Maslow);
        }else if(theoryIndex==1){
            setSelectedTheory(MotivationTheory.Herzberg);
        }else if(theoryIndex==2){
            setSelectedTheory(MotivationTheory.Mcclelland);
        }
    },[theoryIndex])

    useEffect(()=>{
        const request = async()=>{
            let surveys:SurveyTableData[] = await getSurveys();
            let ids = surveys.map(s=>s.name);
            setSurveyIds(ids);
            setSelectedSurveyId(ids[0])
        }
        request();
    },[])


    return(
    <>
        <Menu>
            <img src={MenuIcon} className="h-12 w-12 m-4"></img>
        </Menu>
        <div className="h-full w-full flex flex-row">
            <div className={`hero p-20 flex flex-row justify-center items-center ${backgroundClasses[theoryIndex]}`}>
                <div className="border-l-4 border-white w-5/6 h-fit flex flex-col  justify-center p-2">
                    <span className="text-3xl font-thin mb-4">{theoryLabels[theoryIndex]}</span>
                    <span className="text-lg leading-loose">
                        {theoryDescriptions[theoryIndex]}
                    </span>
                    <button className="bg-[#19B394] p-4 text-white w-[200px] text-lg mt-20 hover:cursor-pointer rounded-sm">Learn more</button>
                </div>
            </div>
            <div className="h-full w-1/2 flex flex-col items-center justify-start py-10">
                {/* <img src={MaslowDiagram} className="w-5/6 hover:scale-105 cursor-pointer"/> */}
            
                <div className={` w-[500px] h-fit bg-[#19B394] rounded-lg shadow-2xl/15 p-6`}>
                    <div className="font-bold text-3xl  flex flex-row justify-between cursor-pointer">
                        Evaluate Survey Questions 
                    </div>
                        <div className="text-white mt-2">Motivation theory:</div>
                        <select onChange={(e)=>{setTheoryIndex(parseInt(e.target.value))}} className="px-10 py-5 bg-white shadow-xl text-gray-500 cursor-pointer hover:bg-gray-200 my-2 w-5/6">
                            <option value="0">Maslow's hierarchy of needs</option>
                            <option value="1">Herzberg two factor theory</option>
                            <option value="2">Mccleland Theory of needs</option>
                        </select>
                        <div className="text-white mt-2">Survey:</div>
                        <select 
                        onChange={(e)=>{setSelectedSurveyId(e.target.value)}}
                        className="px-10 py-5 bg-white shadow-xl text-gray-500 cursor-pointer hover:bg-gray-200 my-2 w-5/6">
                            {
                                surveyIds.map((id,index)=>(
                                    <option value={id}>{id}</option>
                                ))
                            }
                        </select>
                </div>
                <div className="flex flex-row justify-center items-center space-x-2">
                        <Link to={`/survey-evaluation/${selectedSurveyId}/${selectedTheory}`}>
                        <button 
                        className="flex flex-row items-center justify-center my-6  p-4 bg-white rounded-md border-[#19B394] border-2 text-[#19B394] cursor-pointer hover:bg-emerald-100">
                            <span>Evaluate survey questions</span>
                            <img src={AiStars} className="h-8 w-8 ml-2"/> 
                        </button>
                        </Link>

                        <Link to={`/view-survey-evaluation/${selectedSurveyId}/${selectedTheory}`}>
                        <button 
                        className="flex flex-row items-center justify-center my-6  px-4 py-5 bg-white rounded-md border-[#19B394] border-2 text-[#19B394] cursor-pointer hover:bg-emerald-100">
                            <span>Show existing evaluations</span>
                        </button>
                        </Link>
                </div>

            </div>

        </div>
    </>
    )
}