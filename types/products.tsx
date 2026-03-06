
export interface FeedItem {
    title : string,
    estimated_size : string,
    image_url : string,
    product_id : string,
}

export interface FeedResponse {
    data : {
        items : FeedItem[]
    }
}

export interface MyProductResponse {
    data : FeedItem[]
}


export interface ProductByIDImageContent {
    photo_id : string,
    product_id : string,
    image_url : string
}


export interface ProductByIdResponse {
    data:{
        product_id : string,
        sellers : {
            user_id: string,
            first_name : string,
            last_name : string,
            avatar_url : string
        },
        title: string,
        category: string,
        estimated_size: string,
        status: string,
        photos: [ProductByIDImageContent]
    }
}

//Product want creation
export interface ProductCreation {
    data : {
        product_id : string
    }
}

export interface PWGetResponse {
    data : {
        want_id : string,
        wanted_category : string,
        wanted_size : string
    }
}