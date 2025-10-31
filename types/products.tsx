


export interface CprodReq {
    data : {
        product : {
            product_id : string,
            seller : {
                email: string,
                first_name : string,
                last_name : string,
                avatar_url : string,
                location : string
            }
        }
    }
}