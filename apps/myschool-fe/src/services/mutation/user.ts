import { axiosInstance } from "@/utils/interceptor";
import type { UserBody } from "@myschool/schema/api/user";
import { useMutation } from "@tanstack/react-query";

const url = `${import.meta.env.VITE_BE_BASE_URL}`;

export function useSignupUser() {
  return useMutation({
        mutationFn : async (body : UserBody) => {
            const response = await axiosInstance.post(`${url}/users/signup`, body)
            return response.data;
        }
    })
}