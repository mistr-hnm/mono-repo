import { axiosInstance } from "@/utils/interceptor";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { PaginationState } from "@tanstack/react-table";

const url = `${import.meta.env.VITE_BE_BASE_URL}`;

export function useGetStudents(searchText : string ,pagination : PaginationState) {
    return useQuery({
        queryKey : ["students", pagination, searchText],
        retry : false,
        queryFn : async () => {
            let uri = `${url}/students?page=${pagination.pageIndex}&limit=${pagination.pageSize}`;
            if(searchText) uri += `&searchTerm=${searchText}`;
           const response = await axiosInstance.get(uri) 
           
           if(response.status !== 200) throw await response.data; 
           return response.data;
        },
        placeholderData: keepPreviousData
    })
}


export function useGetStudentById(id : string) {
    
    return useQuery({
        queryKey : ["students",id],
        retry : false,
        queryFn : async () => {
           const response = await axiosInstance.get(`${url}/students/${id}`)    
             
           if(response.status !== 200) throw await response.data; 
           return response.data;
        }
    })
}