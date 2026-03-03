import { MyProductResponse } from "@/types/products";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';

const apiUrl = "http://192.168.0.134:8080/pointSwapApi/v1"




class MyAdvertService {
    private axiosInstance;

    constructor(){
        this.axiosInstance = axios.create({
            baseURL: apiUrl
        })
    }



     //Get all users product
     async getUsersProducts(){
        const token = await SecureStore.getItemAsync('token')

        const response = await this.axiosInstance.get<MyProductResponse>('/products/me', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data.data
     }
    

}

export default new MyAdvertService();