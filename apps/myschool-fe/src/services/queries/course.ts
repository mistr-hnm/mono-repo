import { axiosInstance } from "@/utils/interceptor";
import { useQuery } from "@tanstack/react-query";
import type { PaginationState } from "@tanstack/react-table";

const url = `${import.meta.env.VITE_BE_BASE_URL}`;

export function useGetCourses(pagination : PaginationState, searchText ?: string) {
    return useQuery({
        queryKey : ["courses",pagination ,searchText],
        retry : false,
        queryFn : async () => {
            let uri = `${url}/courses?page=${pagination.pageIndex}&limit=${pagination.pageSize}`;
            if(searchText) uri += `&searchTerm=${searchText}`;
            
            const response = await axiosInstance.get(uri)    
             
           if(response.status !== 200) throw await response.data; 
           return response.data;
        }
    })
}


export function useGetCourseById(id : string) {
    
    return useQuery({
        queryKey : ["courses",id],
        retry : false,
        queryFn : async () => {
           const response = await axiosInstance.get(`${url}/courses/${id}`)    
             
           if(response.status !== 200) throw await response.data; 
           return response.data;
        }
    })
}

