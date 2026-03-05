import { login, signup } from "@/services/auth";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";


export function useSignup(){
    return useMutation({
        mutationFn: signup,
        onSuccess: (data) => {
            Cookies.set('token', data.data.token);
        },
        onError: (error) => {
            console.log(error);
        },
    })
}


export function useLogin(){
    return useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            Cookies.set('token', data.data.token);
        },
        onError: (error) => {
            console.log(error);
        },
    })
}