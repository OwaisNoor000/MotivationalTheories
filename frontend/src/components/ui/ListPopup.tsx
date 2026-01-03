import { Link } from "react-router-dom";
import CloseIcon from "../../assets/close-icon.svg";

export type ListPopupEntry = {
    labelName:string;
    pagePath:string;
}

export type ListPopupProps = {
    entries:ListPopupEntry[];
    visible:boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    title:string;
}

export default function ListPopup({entries,visible,setVisible,title}:ListPopupProps){
    const hidePanel = ()=>{
        setVisible(false);
    }

    
    return (
        <div className={`fixed z-10 left-1/2  top-1/2 -translate-x-[250px] -translate-y-[250px] w-[500px] h-fit bg-[#19B394] rounded-lg shadow-2xl/15 p-6 ${visible?"block":"hidden"}`}>
            <div className="font-bold text-3xl h-full flex flex-row justify-between cursor-pointer">
                {title}
                <img src={CloseIcon} className="h-8 w-8" onClick={hidePanel}/>
            </div>

            {entries.length>0 && entries.map((entry,key)=>(
                <Link to={entry.pagePath}>
                <div key={key} className="px-10 py-5 bg-white shadow-xl text-gray-500 cursor-pointer hover:bg-gray-200 my-2">
                    {entry.labelName}
                </div>
                </Link>
            ))}

            {entries.length<=0 && 
                <div className="font-bold bg-white p-4 m-2">No answers provided for this survey</div>
            }

        </div>
    )
}