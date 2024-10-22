import { Link } from "react-router-dom"
import { Avatar } from "./BlogCard"

export const AppBar=()=>{
    return (
        <div className="border-b flex justify-between px-10 py-4 cursor-pointer">
            <Link to={'/blogs'} className="flex flex-col justify-center">
                 GlowVerse
            </Link>
           
           <div>
               <Avatar size={"big"} name="Manish"/>
           </div>
        </div>
    )
}