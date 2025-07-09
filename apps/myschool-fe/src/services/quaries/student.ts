import { axiosInstance } from "@/utils/instance";
import { useQuery } from "@tanstack/react-query";

const url = `${import.meta.env.VITE_BE_BASE_URL}`;

export function useGetStudents() {
    return useQuery({
        queryKey : ["students"],
        queryFn : async () => {
           const response = await axiosInstance.get(`${url}/students`)
           return response.data;
        }
    })
}
  