import axios from 'axios';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const API_BASE_URL = 'http://192.168.0.134:8080/pointSwapApi/v1';

class OAuthService {
  async signInWithGoogle() {
    try {
      // Configure Google Sign In
      const [request, response, promptAsync] = Google.useAuthRequest({
        iosClientId: '629219093833-0caqeffatok8vnn3rq4keouqeq1uthdo.apps.googleusercontent.com',
        androidClientId: '629219093833-2vkjbiddv51sshj80u8cvaskhttn2fhk.apps.googleusercontent.com',
      });

      // Prompt user to sign in
      const result = await promptAsync();

      if (result.type === 'success') {
        const { authentication } = result;
        
        // Send to your backend
        const response = await axios.post(`${API_BASE_URL}/oauth/login`, {
          firebase_token: authentication?.accessToken,
          provider: 'google',
        });

        return {
          token: response.data.data.token,
          userId: response.data.data.user_id,
          email: response.data.data.email,
          profileComplete: response.data.data.profile_complete,
        };
      }

      return null;
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  }
}

export default new OAuthService();