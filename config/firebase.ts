import { getAnalytics } from "firebase/analytics";
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Get these from Firebase Console → Project Settings → General → Your apps
const firebaseConfig = {
  apiKey: "AIzaSyD2l6sFN0g6FrdPShxqtujlg06SXwb2q6s",
  authDomain: "pointswap-4b4ee.firebaseapp.com",
  projectId: "pointswap-4b4ee",
  storageBucket: "pointswap-4b4ee.firebasestorage.app",
  messagingSenderId: "629219093833",
  appId: "1:629219093833:web:cc133388ca04595e707e98"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Auth
export const auth = getAuth(app);

export default app;