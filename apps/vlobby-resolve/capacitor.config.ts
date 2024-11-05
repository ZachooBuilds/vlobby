import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vlobby.resolve.app',
  appName: 'VLobby Resolve',
  webDir: 'out',
  // server: {
  //   cleartext: true,
  //   url: "https://vlobby-9jw3.vercel.app",
  //   // url: "http://192.168.1.64:3000",
  // },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    },
    CapacitorHttp: {
      enabled: true
    }
  },
  ios: {
    contentInset: 'always',
    allowsLinkPreview: false,
    scrollEnabled: true,
    limitsNavigationsToAppBoundDomains: false,
    // webViewSuspensionEnabled: false
  }
  
  // Use the new way to pass environment variables in Capacitor 6
};

export default config;
