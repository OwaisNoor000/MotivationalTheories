import DocumentAddIcon from "../../assets/document.add.svg";
import Document from "../../assets/document.svg";
import Ruler from "../../assets/ruler.svg";
import RulerPen from "../../assets/ruler-pen.svg";
import { useState } from "react";
import { Link } from "react-router-dom";

type MenuProps = {
    children:React.ReactNode
}

export default function Menu({children}:MenuProps){
    const [open,setOpen] = useState<boolean>(false);

    const toggleDisplay = ()=>{
        if(open){
            setOpen(false);
        }else{
            setOpen(true);
        }
    }

    return (
        <div className="absolute h-full flex flex-row z-10 top-0 left-0">
            <div onClick={toggleDisplay} className={` hover:cursor-pointer transition-transform duration-300
          ${open ? "translate-x-[350px]" : "translate-absolutex-0"}`}>{children}</div>
            <div className={`absolute left-0 top-0 h-full w-[350px] bg-white border-2 border-[#19B394] transition-transform duration-300
                ${open ? "translate-x-0" : "-translate-x-full"}`
            }>
                <Link to="/create-survey">
                    <div className="w-full p-2 text-xl font-bold flex flex-row justify-start items-center text-[#19B394] hover:bg-[#DDF4EF] hover:cursor-pointer">
                        <div className="p-2 rounded-full bg-[#DDF4EF] mx-4">
                        <img src={DocumentAddIcon} className="h-[32px] w-[32px]" ></img>
                        </div>
                        Create Survey
                    </div>
                </Link>
                <Link to="/view-survey">
                <div className="w-full p-2 text-xl font-bold flex flex-row justify-start items-center text-[#19B394] hover:bg-[#DDF4EF] hover:cursor-pointer">
                    <div className="p-2 rounded-full bg-[#DDF4EF] mx-4">
                    <img src={Document} className="h-[32px] w-[32px]" ></img>
                    </div>
                    Edit/Fill Out Survey
                </div>
                </Link>
                <Link to="/theory">
                <div className="w-full p-2 text-xl font-bold flex flex-row justify-start items-center text-[#19B394] hover:bg-[#DDF4EF] hover:cursor-pointer">
                    <div className="p-2 rounded-full bg-[#DDF4EF] mx-4">
                    <img src={Ruler} className="h-[32px] w-[32px]" ></img>
                    </div>
                    Evaluate Survey
                </div>
                </Link>
                <Link to="/theory/answer">
                <div className="w-full p-2 text-xl font-bold flex flex-row justify-start items-center text-[#19B394] hover:bg-[#DDF4EF] hover:cursor-pointer">
                    <div className="p-2 rounded-full bg-[#DDF4EF] mx-4">
                    <img src={RulerPen} className="h-[32px] w-[32px]" ></img>
                    </div>
                    Evaluate Survey Answers
                </div>
                </Link>
            </div>
        </div>
    )
}