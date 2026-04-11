import axios from 'axios';
import * as Location from 'expo-location';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = 'http://192.168.0.134:8080/pointSwapApi/v1';

class LocationService {
  async requestPermission(): Promise<boolean> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  }

  async getCurrentLocation(): Promise<{ latitude: number; longitude: number } | null> {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error('Error getting location:', error);
      return null;
    }
  }

  async sendLocationToBackend(latitude: number, longitude: number): Promise<{ location_state: string; camp_name: string }> {
    const token = await SecureStore.getItemAsync('token');

    const response = await axios.post(
      `${API_BASE_URL}/location/set`,
      {
        latitude,
        longitude,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data;
  }
}

export default new LocationService();