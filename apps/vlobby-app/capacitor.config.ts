import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vlobby.app',
  appName: 'vlobby-app',
  webDir: 'out',
  server: {
    cleartext: true,
    url: "https://vlobby-occupant-app.vercel.app",
  },
  
  // Use the new way to pass environment variables in Capacitor 6
};

export default config;
