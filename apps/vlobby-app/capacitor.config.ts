import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vlobby.app',
  appName: 'vlobby-app',
  webDir: 'out',
  server: {
    cleartext: true,
    url: "http://192.168.1.64:3000",
  },
  //   ios: {
  //   contentInset: 'always',
  // },
  
  // Use the new way to pass environment variables in Capacitor 6
};

export default config;
