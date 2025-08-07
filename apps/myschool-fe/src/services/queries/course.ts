import { axiosInstance } from "@/utils/interceptor";
import { useQuery } from "@tanstack/react-query";
import type { PaginationState } from "@tanstack/react-table";

const url = `${import.meta.env.VITE_BE_BASE_URL}`;

export function useGetCourses(pagination : PaginationState) {
    return useQuery({
        queryKey : ["courses",pagination],
        retry : false,
        queryFn : async () => {
           const response = await axiosInstance.get(`${url}/courses?page=${pagination.pageIndex}&limit=${pagination.pageSize}`)    
             
           if(response.status !== 200) throw await response.data; 
           return response.data;
        }
    })
}
