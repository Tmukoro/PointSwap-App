

export interface RegistrationResponse {
    data:{
        token: string;

        user:{
            email: string;
        }
    }
}


export interface LoginResponse {
    data : {
        token: string;

        user : {
            email: string;
            first_name : string;
            last_name : string;
            avatar_url : string;
        }
    }
}



export interface ProfileResponse {
    data :{
        profile_Update :{
            first_name : string,
            last_name : string,
            avatar_url : string
        }
    }
}
