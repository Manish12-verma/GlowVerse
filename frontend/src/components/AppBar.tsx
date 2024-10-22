import { Avatar } from "./BlogCard"

export const AppBar=()=>{
    return (
        <div className="border-b flex justify-between px-10 py-4">
           <div className="flex flex-col justify-center">
                 GlowVerse
           </div>
           <div>
               <Avatar size={"big"} name="Manish"/>
           </div>
        </div>
    )
}