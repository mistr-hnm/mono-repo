import { z }  from 'zod/v4';


const envSchema = z.object({
    PORT : z.coerce.number().min(1),
    HOST : z.string().min(1),
    NODE_ENV : z.enum(["development", "production"]),
    DB_URL : z.string(),
    API_KEY : z.string(),
    SECRET : z.string(),

});

export type EnvSchema = z.infer<typeof envSchema>;

const envResult = envSchema.safeParse(process.env);
if(!envResult.success){
    console.error(z.flattenError(envResult.error));
    throw new Error("Invalid envvariables")
}
const env = envResult.data;

export { env };