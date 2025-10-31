import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const apiUrl = "http://192.168.0.134:8080/pointSwapApi/v1";

export const getUser = async ()=>{
    try{
        const token = AsyncStorage.getItem("token");

        if(!token){
            console.warn("No Token Found")
            return null;
        }

        const response = axios.get(`${apiUrl}/me`,{
            headers:{
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },

        });


        console.log("User Fetched", (await response).data);

        const user = (await response).data

        await AsyncStorage.setItem("user", JSON.stringify(user))

        return user
    }catch(error){
        console.log(error)
    }
}