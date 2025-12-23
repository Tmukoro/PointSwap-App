


export interface FeedItem {
    title : string,
    estimated_size : string,
    image_url : [string],
    product_id : string,
}

export interface FeedResponse {
    data : {
        items : FeedItem[]
    }
}

export interface CreateProduct {
    category : string,
    image_urls : [string],
    title : string,
    estimated_size : string
}