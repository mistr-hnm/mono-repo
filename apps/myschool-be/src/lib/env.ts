import * as z from 'zod/v4'

const envSchema = z.object({
    PORT : z.coerce.number().min(1),
    HOST : z.string().min(1),
    NODE_ENV : z.enum(["development", "production"]),
    DB_URL : z.string(),
    REDIS_URL : z.string(),
    OTHER_URL : z.string(),
    SAMPLE_URL : z.string(),
    API_KEY : z.string(),
    SECRET : z.string(),
    S3_BUCKET_NAME : z.string(),
    S3_REGION : z.string(),
    S3_ACCESS_KEY : z.string(),
    S3_SECRET_ACCESS_KEY : z.string(),
});

console.log("process.env.DB_URL =", process.env.DB_URL);
console.log("process.env.REDIS_URL =", process.env.REDIS_URL);


export type EnvSchema = z.infer<typeof envSchema>;

const envResult = envSchema.safeParse(process.env);
if(!envResult.success){
    console.error(z.flattenError(envResult.error));
    throw new Error("Invalid envvariables")
}
const env = envResult.data;

export { env };