import * as z from 'zod/v4'


export const loginUserBodySchema = z.object({
    email : z.email('Please enter valid email '),
    password : z.string('Please enter password').min(6).max(8),
})

export type LoginUserBody = z.infer<typeof loginUserBodySchema>;