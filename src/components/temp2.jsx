import { IoLogoCodepen } from "react-icons/io";
import { RiNotification4Line } from "react-icons/ri";
function  TopBar()
{
    return (
        <header className="w-full min-h-18 bg-[#374151]  border-b-[1px] border-white text-white
         flex items-center px-4
         justify-between">
           <div className="flex justify-center items-center gap-1">
                <a href="#!" className="scale-300 px-4 hover:opacity-70">
                    <IoLogoCodepen/> 
                    
                </a>
                <span  className="font-bold text-lg">Home</span>
           </div>
           <div className="relative">
               <span className="w-8 h-8  scale-120 block flex items-center justify-center">
                    <RiNotification4Line/>
               </span>
               <span className="inline-block p-1 rounded-full animate-pulse top-1 right-2  absolute z-10 bg-amber-400" ></span>
           </div>
        </header>
    )
}

export default  TopBar