import { ProfileResponse, RegistrationResponse } from "@/types/auth";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';


const apiUrl = "http://192.168.0.134:8080/pointSwapApi/v1"


interface Reg {
    email : string,
    password: string
}

interface pSetup {
    first_name : string,
    last_name : string,
    avatar_url : string
}




class AuthService {
    private axiosInstance;


    constructor(){
        this.axiosInstance = axios.create({
            baseURL: apiUrl
        })
    }

    //Registration of Users
    async Registration({email, password} : Reg){
        const token = await SecureStore.getItemAsync("token")

        const response = await this.axiosInstance.post<RegistrationResponse>('register', {
            email: email,
            password: password
        },{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data.data
    }








    //profile Setup
    async profileSetUp({first_name, last_name, avatar_url} : pSetup){
        const token =  await SecureStore.getItemAsync("token")

        const response = await this.axiosInstance.post<ProfileResponse>('profileSetUp',{
            first_name : first_name,
            last_name : last_name,
            avatar_url: avatar_url,
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return response.data.data
    }











}


export default new AuthService()