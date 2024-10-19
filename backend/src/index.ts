import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign,verify } from 'hono/jwt';
//create the main hono app

const app = new Hono<{
	Bindings: {
		DATABASE_URL: string
    JWT_SECRET:string
	}
}>();

app.use('/api/v1/blog/*', async (c,next)=>{
  //get the header => verify the header => if the header is correct we can proceed
  //if not we tell the user 403 status code 
  const header = c.req.header("authorization") || "";

  //Bearer token => ["Bearer","token"]
  const token = header.split(" ")[1];

  
    const response = await verify(token,c.env.JWT_SECRET)
    if(response.id){
       next()
    }else{
      c.status(403)
      return c.json({error:"unauthorized"})
    }
   
})

app.post('/api/v1/signup', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate());

const body = await c.req.json();

try{
  const user = await prisma.user.create({
      data:{
        email:body.email,
        password:body.password,
        name:body.name
      }
})
  const token = await sign({id:user.id},c.env.JWT_SECRET)
  return c.json({  
    jwt:token
  })
}catch(e){
   c.status(411);
   return c.text('Invalid')
}
})


app.post('/api/v1/signin', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	const body = await c.req.json();
	const user = await prisma.user.findUnique({
		where: {
			email: body.email,
      password:body.password
		}
	});

	if (!user) {
		c.status(403);
		return c.json({ error: "user not found" });
	}

	const jwt = await sign({ id: user.id }, c.env.JWT_SECRET); //if user exist signin
	return c.json({ jwt });
})


app.post('/api/v1/blog',(c)=>{
  return c.text('blog posted')
})

app.put('/api/v1/blog',(c)=>{
  return c.text('blog updated')
})

app.get('/api/v1/blog/:id',(c)=>{
  const id =c.req.param('id')
  console.log(id)
  return c.text('blog fetched with the given id')
})

app.get('/api/v1/blog/bulk',(c)=>{
  return c.text('fetched blogs in bulk')
})


export default app
