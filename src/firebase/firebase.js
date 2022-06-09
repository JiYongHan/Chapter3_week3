import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyBbSmbbFLUBrzfm3V4aMfNoSEvasCLdTCs",
    authDomain: "auth-6eb37.firebaseapp.com",
    projectId: "auth-6eb37",
    storageBucket: "auth-6eb37.appspot.com",
    messagingSenderId: "790929052333",
    appId: "1:790929052333:web:180e0edceafeff0eb6ac24",
    measurementId: "G-QC4F23CSQ1"
};

const app = initializeApp(firebaseConfig);
// DB 연결
export const db = getFirestore(app);
// 인증 연결
export const auth = getAuth();
// 이미지 저장소 연결
export const storage = getStorage(app);
export default app;

