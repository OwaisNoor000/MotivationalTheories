
export type ListBoxProps = {
    entries:string[];
}

export default function ListBox({entries}:ListBoxProps){

    
    return (
        <div className={` w-[500px] h-fit bg-[#19B394] rounded-lg shadow-2xl/15 p-6`}>
            <div className="font-bold text-3xl  flex flex-row justify-between cursor-pointer">
            </div>

            {entries.length>0 && entries.map((entry,key)=>(
                <div key={key} className="px-10 py-5 bg-white shadow-xl text-gray-500 cursor-pointer hover:bg-gray-200 my-2">
                    {entry}
                </div>
            ))}

            {entries.length<=0 && 
                <div className="font-bold bg-white p-4 m-2">Nothing to show here</div>
            }

        </div>
    )
}