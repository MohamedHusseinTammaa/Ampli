import api from "@/lib/apis"

export async function signup(data){
    const response=await api.post("/user/signup",data);
    return response
}
export async function login(data){
    const response=await api.post("/user/login",data);
    return response
}