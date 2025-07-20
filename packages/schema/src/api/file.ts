import * as z from 'zod/v4'

export const uploadFileSchema = z.object({
    file : z.file(),
})

export type UploadFileBody = z.infer<typeof uploadFileSchema>;