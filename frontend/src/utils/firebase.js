// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyDLL2YbYAL16ajzWQrvTPau28-YtTeSkL8",
	authDomain: "ratemysite-cb476.firebaseapp.com",
	projectId: "ratemysite-cb476",
	storageBucket: "ratemysite-cb476.firebasestorage.app",
	messagingSenderId: "134736581585",
	appId: "1:134736581585:web:f9030e1323268eda2dc6f0",
	measurementId: "G-90BQYTECJF",
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);
