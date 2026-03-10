import CategoryBoxV2 from "@/components/categoryBoxV2";
import BottomSheetDropdown from "@/components/dropdown";
import BackIcon from "@/components/SvgIcons/backIcon";
import ExportIcon from "@/components/SvgIcons/exportIcon";
import myAdvert from "@/services/myAdvert";
import { ProductByIdResponse } from "@/types/products";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function AdvertViewScreen(){
    const route = useRouter()
    const {product_id} = useLocalSearchParams();
    const apiUrl = `http://192.168.0.134:8080/pointSwapApi/v1/products/${product_id}`;

    const [imageUrls, setImageUrls] = useState<string[]>([])
    const [title, setTitle] = useState<string>('')
    const [category, setCategory] = useState<string>('')
    const [size, setSize] = useState<string>('')
    const sizeOptions = ['S', 'M', 'L', 'XL'];
    const [loading, setLoading] = useState<boolean>()
    const [wantedCategory, setWantedCategory] = useState<string>(category)
    const [wantedSize, setWantedSize] = useState<string>('')



    const loadProductData = async () => {
          try{
            setLoading(true)
            const respone = await axios.get<ProductByIdResponse>(apiUrl)
            const wantData = await myAdvert.getUserProductWant(product_id)
            
            setImageUrls(respone.data.data.photos.map(photo => photo.image_url))
            setTitle(respone.data.data.title)
            setCategory(respone.data.data.category)
            setSize(respone.data.data.estimated_size)
            setWantedCategory(wantData.wanted_category)
            setWantedSize(wantData.wanted_size)

          }catch(error){
            console.error("Failed to get product: ", error)
          }finally{
            setLoading(false)
          }
    }


    const deleteProduct = async()=>{
        Alert.alert(
            `Delete`,
            'Are you sure you want to delete this item?',
            [
                {text: 'cancel', style: 'cancel'},
                {
                    text: 'delete',
                    style: 'destructive',
                    onPress: async()=> {
                        try{
                            await myAdvert.DeleteProduct(product_id)
                            route.push('/(screens)/myAdvert')
                        }catch(error){
                            console.error("Couldnt delete error: ", error)
                        }
                    },
                },
            ],

            {cancelable: true}
        );
    }

    const updateProduct = async()=>{
        try{
            await myAdvert.updateProductWant({
                wantedCategory: wantedCategory,
                wantedSize: wantedSize
            }, product_id)

            loadProductData()
        }catch(error){
            console.error("Coudln't update: ", error)
        }
    }

    useEffect(()=>{
        loadProductData()
    }, [])

    
    if(loading){
        return(
        <View>
            <ActivityIndicator size={'large'}/>
        </View>
        )
    }




    return(
        <View style={styles.container}>

            <View style={styles.headerContainer}>

                <View style={styles.navigationBox}>
                <TouchableOpacity style={styles.backIcon} onPress={()=> route.back()}>
                <BackIcon color={'#000'} />
                <Text style={{fontSize: 16, fontWeight: 400}}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <ExportIcon />
                </TouchableOpacity>
                </View>
            </View>

            {/* IMAGE BOX */}
            <View style={styles.ImageContainer}>
              <FlatList
               data={imageUrls}
               keyExtractor={(_,index)=> index.toString()}
               horizontal
               showsHorizontalScrollIndicator={false}
               renderItem={({item})=>(
                   <Image source={{uri: item}}
                   style={styles.imagedata}
                   resizeMode="cover"
                   />
               )}
              
              />
            </View>


            {/* DETAILS BOX */}
            <View style={styles.detailsBox}>
              <Text style={{
                fontSize: 24, fontWeight: 600, paddingBottom: 10
                 }}
                >{title}
                </Text>

              <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between'
              }}>
              <Text style={styles.content}>Category</Text>
               <Text style={styles.contentValue}>{category}</Text>
              </View>

              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}>
                <Text style={styles.content}>Size</Text>
                <Text style={styles.contentValue}>{size}</Text>
              </View>

              <View style={styles.rect}></View>
            </View>


            {/* IN RETURN BOX */}

            <View style={styles.returnBox}>

                <Text style={{fontWeight: 600}}>
                Change the Size of what you want?
                </Text>
                 
                 <CategoryBoxV2
                  label="Category"
                  placeholder={category}
                  selectedValue={wantedCategory}
                  onSelect={setWantedCategory}
                  />
               
               <View style={{width: '98%'}}>
                <BottomSheetDropdown
                label='Wanted Size (required)'
                placeholder='Select'
                options={sizeOptions}
                selectedValue={wantedSize}
                onSelect={setWantedSize}
                />
               </View>
            </View>



            {/* OPTIONS BOX */}

            <View style={styles.optionsBox}>

                <TouchableOpacity style={styles.btn1} onPress={deleteProduct}>
                    <Text style={styles.btnTxt}>Delete</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btn2} onPress={updateProduct}>
                    <Text style={styles.btnTxt}>Update</Text>
                </TouchableOpacity>

            </View>



                

            





        </View>
    )
}


const styles = StyleSheet.create({
    container: {
       padding: 0,
       margin: 0,
       alignContent: 'center',
       alignItems: 'center',
       backgroundColor: '#fff',
       height: '100%',
       paddingHorizontal: 13
    },

    headerContainer : {
        height: 90,
        width: '100%',
    },

    navigationBox : {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        top: 50
    },

    backIcon:{
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7
    },

    ImageContainer: {
        width: '100%',
        height: 210,
        marginTop: 5, 
    },

    imagedata : {
        width: 350,
        height: 200,
        borderRadius: 12,
        marginRight: 10,
        
    },

    detailsBox: {
        width: '100%',
        height: 120,
        marginTop: 10,
        paddingHorizontal: 4
    },

    content: {
       fontSize: 14,
       fontWeight: 400,
       color: '#757575',
       paddingVertical: 5
    },

    contentValue: {
        fontSize: 14,
        fontWeight: 400,
        color: '#191919',
        paddingVertical: 5
    },

    rect: {
      alignSelf: 'center',
      borderWidth: 1,
      borderColor: '#E6E6E6',
      width: 360,
      height: 0.1,
      marginVertical: 10
    },

    returnBox: {
        width: '100%',
        paddingHorizontal: 2,
        marginTop: 10
    },

    optionsBox : {
        width: '100%',
        marginTop : 40,
        flexDirection: 'row',
        gap: 45,
        justifyContent: 'center'
    },

    btn1 :{
        backgroundColor : 'red',
        padding: 15,
        borderRadius: 8,
        paddingHorizontal: 50,
        alignItems: 'center'
    },

    btn2 : {
        backgroundColor: '#6734F2',
        padding: 15,
        borderRadius: 8,
        paddingHorizontal: 50,
        alignItems: 'center'
    },

    btnTxt : {
        fontWeight: 600,
        color: '#fff',
    }


})