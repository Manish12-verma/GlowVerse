import z from "zod";


//this all are the runtime variables =>so they might cause issue in frontend part
export const signupInput = z.object({
    email:z.string().email(),
    password:z.string().min(6),
    name:z.string().optional()
})

export type SignupInput = z.infer<typeof signupInput>

