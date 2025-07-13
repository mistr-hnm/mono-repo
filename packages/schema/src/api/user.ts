import * as z from 'zod/v4'


export const passwordSchema = z
  .string()
  .min(8, "Must contain at least 8 characters")
  .regex(/[A-Z]/, "Must contain at least one capital letter")
  .regex(/[a-z]/, "Must contain at least one lowercase letter")
  .regex(/\d/, "Must contain at least one digit")
  .regex(/[^A-Z0-9]/i, "Must contain at least one special character");


export const userBodySchema = z.object({
    name : z.string().min(2,"Must be more then 2").max(10, "Must be less then 20"),
    email : z.email('Please enter valid email '),
    password : passwordSchema,
})

export type UserBody = z.infer<typeof userBodySchema>