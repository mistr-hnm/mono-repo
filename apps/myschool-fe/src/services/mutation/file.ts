import { axiosInstance } from "@/utils/interceptor";
import { useMutation } from "@tanstack/react-query";
import type { UploadFileBody } from "@myschool/schema/api/file";

const url = `${import.meta.env.VITE_BE_BASE_URL}`;

export function useUploadFile() {
  return useMutation({
    mutationFn: async (body: UploadFileBody) => {
      const formData = new FormData()
      formData.append("file", body.file)
      const response = await axiosInstance.post(`${url}/files`, formData)
      return response.data;
    }
  })
}