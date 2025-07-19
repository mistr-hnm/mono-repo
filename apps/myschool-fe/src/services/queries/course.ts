import { axiosInstance } from "@/utils/interceptor";
import { useQuery } from "@tanstack/react-query";

const url = `${import.meta.env.VITE_BE_BASE_URL}`;

export function useGetCourses() {
    return useQuery({
        queryKey : ["courses"],
        queryFn : async () => {
           const response = await axiosInstance.get(`${url}/courses`)      
           return response.data.data;
        }
        // @todo error handling
    })
}
  