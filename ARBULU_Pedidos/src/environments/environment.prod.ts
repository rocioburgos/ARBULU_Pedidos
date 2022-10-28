import { initializeApp } from 'firebase/app';
import { CapacitorConfig } from '@capacitor/cli';

export const environment = {
  firebase: {
    apiKey: "AIzaSyBGo03lJ00Y-cfMvUpB_sK8fHv0_MyHP9M",
    authDomain: "arbulu-86577.firebaseapp.com",
    projectId: "arbulu-86577",
    storageBucket: "arbulu-86577.appspot.com",
    messagingSenderId: "784743923611",
    appId: "1:784743923611:web:fdf1cb2b087010ed6b6b3e"
  },
  production: true,
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: '#ffffffff',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#999999',
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: 'launch_screen',
      useDialog: true,
    },
  },
};

// Initialize Firebase
const app = initializeApp(environment.firebase);