import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vlobby.app',
  appName: 'vlobby-app',
  webDir: 'out',
  server: {
    url: 'http://192.168.1.64:3000',
    cleartext: true,
  },
};

export default config;
