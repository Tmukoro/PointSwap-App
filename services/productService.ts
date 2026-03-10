import { ProductCreation } from "@/types/products";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';

interface CreateProduct {
    category: string,
    photo_urls: string[],
    title: string,
    estimated_size: string
}

interface ProductWant {
    wantCategory : string,
    wantSize : string
}

const apiUrl = "http://192.168.0.134:8080/pointSwapApi/v1"

class ProductService {
    private axiosInstance;

    constructor(){
        this.axiosInstance = axios.create({
            baseURL: apiUrl
        })
    }


   

    //  Create a product
    async CreateProduct({category, photo_urls, title, estimated_size} : CreateProduct){
        const token = await SecureStore.getItemAsync('token')
        const response = await this.axiosInstance.post<ProductCreation>('/products', {
            category: category,
            image_urls : photo_urls,
            title : title,
            estimated_size: estimated_size,
        },{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return response.data.data
    }

    //Create what the user wants in return

    async CreateProductWant({wantCategory, wantSize}: ProductWant, productID: string){
        const token = await SecureStore.getItemAsync('token')
        const response = await this.axiosInstance.post(`/product_wants/${productID}/want`, {
            wanted_category : wantCategory,
            wanted_size: wantSize
        },{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return response.data
    }







}


export default new ProductService()