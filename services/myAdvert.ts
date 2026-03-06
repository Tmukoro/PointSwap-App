import { MyProductResponse, PWGetResponse } from "@/types/products";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';

const apiUrl = "http://192.168.0.134:8080/pointSwapApi/v1"

interface productWant {
    wantedCategory: string,
    wantedSize: string
}


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

     //Getting the users want (to check if it exists or not)

     async getUserProductWant(product_id: string | string[]){
        const token = await SecureStore.getItemAsync('token')

        const response = await this.axiosInstance.get<PWGetResponse>(`/product_wants/${product_id}/want`,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data.data
     }


    //  UPDATE USERS PRODUCT WANT
     async updateProductWant({wantedCategory, wantedSize}: productWant, productID: string | string[]){
        const token = await SecureStore.getItemAsync('token')
          await this.axiosInstance.put(`/product_wants/${productID}/want`,{
              wanted_category: wantedCategory,
              wanted_size: wantedSize
          },{
            headers: {
                Authorization: `Bearer ${token}`
            }
          })
     }




     //Allows User to delete their product
     async DeleteProduct(product_id: string | string[]){
        const token = await SecureStore.getItemAsync('token')

        await this.axiosInstance.delete(`/products/${product_id}`,{
            headers : {
                Authorization: `Bearer ${token}`
            }
        })
     }
    

}

export default new MyAdvertService();