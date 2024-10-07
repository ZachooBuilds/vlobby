declare module 'pushy-cordova' {
  import Pushy from 'pushy';

  const PushyCordova: {
    listen: () => void;
    register: (callback: (err: any, deviceToken: string) => void) => void;
    setNotificationListener: (callback: (data: any) => void) => void;
    setNotificationClickListener: (callback: (data: any) => void) => void;
  } & typeof Pushy;

  export default PushyCordova;
}