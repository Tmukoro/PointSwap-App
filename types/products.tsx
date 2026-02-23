
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

export interface ImageContent {
    photo_id : string,
    product_id : string,
    image_url : string,
    display_order: 1
}

export interface ProductByIDImageContent {
    photo_id : string,
    product_id : string,
    image_url : string
}



export interface productResponse {
    data : {
        product : {
            product_id : string,
            sellers : {
                user_id : string,
            },
            title : string,
            category : string,
            estimated_size: string,
            status : string,
            photos : [ImageContent],
        }
    }
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