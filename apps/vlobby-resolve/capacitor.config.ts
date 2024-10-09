import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vlobby.resolve.app',
  appName: 'VLobby Resolve',
  webDir: 'out',
  server: {
    cleartext: true,
    // url: "https://vlobby-occupant-app.vercel.app",
    url: "http://192.168.1.64:3000",
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  }
  
  // Use the new way to pass environment variables in Capacitor 6
};

export default config;
