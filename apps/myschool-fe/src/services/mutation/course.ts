import { axiosInstance } from "@/utils/interceptor";
import { useMutation, useQueryClient } from "@tanstack/react-query";
const url = `${import.meta.env.VITE_BE_BASE_URL}`;

// @todo : make proper type casting

export function useCreateMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn : async (body :  any) => {
        const response = await axiosInstance.post(`${url}/courses`, body)
        
        if(response.status !== 200 ) throw await response.data; 
        return response.data.data;
     },
     onSuccess :() => {
      queryClient.invalidateQueries({ queryKey : ["courses"]})
    }
  })
}


export function useUpdateMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn : async ({id , body} : {id: string, body : any}) => {
        const response = await axiosInstance.put(`${url}/courses/${id}`, body);
        
        if(response.status !== 200 ) throw await response.data; 
        return response.data.data;
     },
     onSuccess :() => {
      queryClient.invalidateQueries({ queryKey : ["courses"]})
    }
  })
}



export function useDeleteMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn : async ({id} : { id: string }) => {
        const response = await axiosInstance.delete(`${url}/courses/${id}`);
        
        if(response.status !== 200 ) throw await response.data; 
        return response.data.data;
     },
     onSuccess :() => {
      queryClient.invalidateQueries({ queryKey : ["courses"]})
    }
  })
}



