import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'arbulu',
  appName: 'ARBULU',
  webDir: 'www',
  bundledWebRuntime: false,
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 6000,
      "launchAutoHide": true,
      "backgroundColor": "#ffffffff",
      "androidSplashResourceName": "splash",
      "androidScaleType": "CENTER_CROP",
      "androidSpinnerStyle": "large",
      "iosSpinnerStyle": "small",
      "spinnerColor": "#999999",
      "showSpinner": true,
      "splashFullScreen": true,
      "splashImmersive": true
    }
  }
};

export default config;