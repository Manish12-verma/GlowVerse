import { Hono } from "hono"
import { verify } from "hono/jwt";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { auth } from "hono/utils/basic-auth";

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

    
      const user = await verify(authHeader,c.env.JWT_SECRET)

      if(user){
        //@ts-ignore
        c.set('userId',user.id);
          await next();
      }else{
        c.status(403)
        return c.json({error:"unauthorized"})
      }
  })

blogRouter.post('/',async (c)=>{
    const body = await c.req.json();
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

  
  //pagination can be added here => to return only few number of page at starting 

  blogRouter.get('/bulk',async (c)=>{

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
     
   const blogs =  await prisma.post.findMany();


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
  
