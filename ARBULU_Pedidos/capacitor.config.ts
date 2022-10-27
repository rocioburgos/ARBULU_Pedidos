import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'arbulu',
  appName: 'ARBULU',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,

      backgroundColor: '#ffffffff',

      launchAutoHide: true,

      androidSplashResourceName: 'launch_splash',
    },
  },
};

export default config;