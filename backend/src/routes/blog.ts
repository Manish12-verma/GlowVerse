import { Hono } from "hono"
import { verify } from "hono/jwt";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { createBlogInput, CreateBlogInput,updateBlogInput } from "@manishverma/glowverse-common";

export const blogRouter= new Hono<{
	Bindings: {
		DATABASE_URL: string
       JWT_SECRET:string
	},
    Variables: {
        userId:string
    }
}>();

blogRouter.use('/*', async (c,next)=>{
    // //get the header => verify the header => if the header is correct we can proceed
    // //if not we tell the user 403 status code 
      const authHeader = c.req.header("authorization") || "";  //default empty string

     try{
      const user = await verify(authHeader,c.env.JWT_SECRET)

      if(user){
        //@ts-ignore
        c.set('userId',user.id);
          await next();
      }else{
        c.status(403)
        return c.json({error:"You are not logged in"})
      }
    }catch(e){
        c.status(403)
        return c.json({error:"You are not logged in"})
    }
  })

blogRouter.post('/',async (c)=>{
    const body = await c.req.json();

    const {success} =  createBlogInput.safeParse(body);
    if(!success){
        c.status(411);
        return  c.json({
            message:"Inputs are not correct"
        })

    }
    const authorId = c.get("userId");
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const blog = await prisma.post.create({
         data:{
            title:body.title,
            content:body.content,
            authorId: authorId
         }
    })

    return c.json({
        id:blog.id
    })
  })
  
  blogRouter.put('/',async (c)=>{ 
    const body = await c.req.json();

    //zod validation
    const {success} =  updateBlogInput.safeParse(body);
    if(!success){
        c.status(411);
        return  c.json({
            message:"Inputs are not correct"
        })
    }
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const blog = await prisma.post.update({
        where:{
            id:body.id
        },
         data:{
            title:body.title,
            content:body.content 
         }
    })
    return c.json({
        id:blog.id
    })
  })

  
  //pagination 
  blogRouter.get('/bulk',async (c)=>{

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    
   const blogs =  await prisma.post.findMany(
    {
        select:{
            content:true,
            title:true,
            id:true,
            author:{
                   select:{
                    name:true
                   }
            }
        }
    }
   );

    return c.json({
        blogs
    })
  })
  
  

  
  blogRouter.get('/:id',async(c)=>{
        const id =  c.req.param("id");
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try{
    const blog = await prisma.post.findFirst({
        where:{
            id: id
        },
        select:{
              id:true,
              title:true,
              content:true,
              author:{
                select:{
                    name:true
                }
              }
        }
    })

    return c.json({
        blog
    })
}catch(e){
    
    c.status(404)
    return c.json({
        message:"Error while fetching blog post"
    })
}

  })
  
