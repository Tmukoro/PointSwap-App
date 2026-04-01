import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
const API_BASE_URL = 'http://192.168.0.134:8080/pointSwapApi/v1';

class UploadService {
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
    });
  }

  // Upload single image
  async uploadImage(imageUri: string, type: 'profile' | 'product' | 'chat'): Promise<string> {
    const formData = new FormData();
    const token = await SecureStore.getItemAsync("token");

    const filename = imageUri.split('/').pop() || 'image.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const fileType = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('images', {
      uri: imageUri,
      name: filename,
      type: fileType,
    } as any);

    const response = await this.axiosInstance.post(`/upload/image?type=${type}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.data.data.image_url;

  }

  // Upload multiple images
  async uploadImages(imageUris: string[], type: 'profile' | 'product' | 'chat'): Promise<string[]> {
    const formData = new FormData();
    const token = await SecureStore.getItemAsync("token");

    imageUris.forEach((uri, index) => {
      const filename = uri.split('/').pop() || `image${index}.jpg`;
      const match = /\.(\w+)$/.exec(filename);
      const fileType = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('images', {
        uri: uri,
        name: filename,
        type: fileType,
      } as any);
    });

    const response = await this.axiosInstance.post(`/upload/image?type=${type}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
    });

    // For multiple uploads, always expect image_urls (plural)
    return response.data.data.image_urls;
  }
}

export default new UploadService();