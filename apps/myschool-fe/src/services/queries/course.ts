import { axiosInstance } from "@/utils/interceptor";
import { useQuery } from "@tanstack/react-query";
import type { PaginationState } from "@tanstack/react-table";

const url = `${import.meta.env.VITE_BE_BASE_URL}`;

export function useGetCourses(searchText : string, pagination : PaginationState) {
    return useQuery({
        queryKey : ["courses",pagination],
        retry : false,
        queryFn : async () => {
           const response = await axiosInstance.get(`${url}/courses?page=${pagination.pageIndex}&limit=${pagination.pageSize}`)    
             
           if(response.status !== 200) throw await response.data; 
           return response.data;
        },
        enabled : searchText === ""
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


export function useSearchCourse(searchText : any, body: any) {
    console.log("body==>",body);
    
    return useQuery({
        queryKey : ["courses",searchText],
        retry : false,
        queryFn : async () => {
           const response = await axiosInstance.post(`${url}/courses/search`, body)
           console.log("response",response);
           if(response.status !== 200) throw await response.data; 
           return response.data;
        },
        enabled : searchText !== ""
    })
}

