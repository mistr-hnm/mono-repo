import { axiosInstance } from "@/utils/interceptor";
import { useQuery } from "@tanstack/react-query";

const url = `${import.meta.env.VITE_BE_BASE_URL}`;

export function useGetCourses() {
    return useQuery({
        queryKey : ["courses"],
        retry : false,
        queryFn : async () => {
           const response = await axiosInstance.get(`${url}/courses`)    
             
           if(response.status !== 200) throw await response.data; 
           return response.data.data;
        }
    })
}
