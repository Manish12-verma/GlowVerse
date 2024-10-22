import { useBlog } from "../hooks"


export const Blog = ()=>{
    const {loading,blog} = useBlog();
    if(loading){
        return <div>
              loading...
        </div>
    }
    return (
        <div>
           blog
        </div>
        )
}