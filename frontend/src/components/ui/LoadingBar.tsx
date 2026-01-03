import { useEffect, useState } from "react"

export default function LoadingBar(){
    const [progress,setProgress] = useState<number>(0);
    const [loadIndex,setLoadIndex] = useState<number>(0);
    const [loadTextTranslate,setLoadTextTransate] = useState<number>(3000);

    const loadingTexts = [
                    "Adding justifications to batch 3",
                    "Adding justifications to batch 2",
                    "Adding justifications to batch 1",
                    "Generating report section 2",
                    "Generating report section 1",
                    "Classifying records batch=3 ",
                    "Classifying records batch=2 ",
                    "Classifying records batch=1 ",
                    "Forming LLM prompt",
                    "Compiling data into schemas",
                    "Validating surveyIds",
    ]

    useEffect(()=>{
    let progressClock = setInterval(()=>{
        if(progress>=100){
            setProgress(0);
        }else{
            setProgress((progress)=>progress+10);
        }

        if(loadTextTranslate<=0){
            setLoadTextTransate(3000);
        }else{
            setLoadTextTransate((loadTextTranslate)=>loadTextTranslate-300)
        }

        

    },2000);


        return ()=>clearInterval(progressClock)
    },[progress,loadTextTranslate])


    return (
        <div className=" h-full w-full flex flex-col justify-center items-center">
            <div className="border w-[500px] h-[50px] ">
                <div className={`bg-[#19B394] h-full`} style={{transition:"width 0.5s linear",width:`${progress}%`}}></div>
            </div>
                <div className="w-[300px] h-[100px] overflow-x-hidden flex flex-row justify-start items-center my-4 ">
                    {
                        loadingTexts.map((text,index)=>(
                            <div key={index}  
                            className="flex flex-row shrink-0 justify-center w-[300px]"
                            style={{translate:`-${loadTextTranslate}px 0px`,transition:"translate 0.5s linear"}}
                            >{text}</div>
                        ))
                    }
                </div>
        </div>
    )
}