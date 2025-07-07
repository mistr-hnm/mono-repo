import { axiosInstance } from './instance';

const url = `${import.meta.env.VITE_BE_BASE_URL}/api`;

export const getCourses = async() =>{
   return await axiosInstance.get(`${url}/courses`);
}

export const createCouses = async (body: any) => {
   return await axiosInstance.post(`${url}/courses`, body);
}

export const getCourse = async (id: string) => {
   return await axiosInstance.get(`${url}/courses/` + id);
}

export const updateCouses = async (id: string,body: any) => {
   return await axiosInstance.put(`${url}/courses/${id}`, body);
}


export const deleteCouses = async (id: string) => {
   return await axiosInstance.delete(`${url}/courses/${id}`);
}


export const getStudents = async() =>{
   return await axiosInstance.get(`${url}/students`);
}

export const createStudent = async (body: any) => {
   return await axiosInstance.post(`${url}/students`, body);
}

export const getStudent = async (id: string) => {
   return await axiosInstance.get(`${url}/students/` + id);
}

export const updateStudent = async (id: string,body: any) => {
   return await axiosInstance.put(`${url}/students/${id}`, body);
}


export const deleteStudent = async (id: string) => {
   return await axiosInstance.delete(`${url}/students/${id}`);
}