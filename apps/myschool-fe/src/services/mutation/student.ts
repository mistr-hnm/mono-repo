import { axiosInstance } from "@/utils/instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
const url = `${import.meta.env.VITE_BE_BASE_URL}`;

// @todo : make proper type casting

export function useCreateMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn : async (body :  any) => {
        const response = await axiosInstance.post(`${url}/students`, body)
        return response.data;
     },
     onSuccess :() => {
      queryClient.invalidateQueries({ queryKey : ["students"]})
    }
  })
}


export function useUpdateMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn : async ({id , body} : {id: string, body : any}) => {
        const response = await axiosInstance.put(`${url}/students/${id}`, body);
        return response.data;
     },
     onSuccess :() => {
      queryClient.invalidateQueries({ queryKey : ["students"]})
    }
  })
}



export function useDeleteMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn : async ({id} : { id: string }) => {
        const response = await axiosInstance.delete(`${url}/students/${id}`);
        return response.data;
     },
     onSuccess :() => {
      queryClient.invalidateQueries({ queryKey : ["students"]})
    }
  })
}



