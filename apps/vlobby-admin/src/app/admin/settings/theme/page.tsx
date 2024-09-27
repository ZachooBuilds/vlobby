import BannerImageUpload from "./_component/banner-image";
import IconUpload from "./_component/icon-upload";
import LogoUpload from "./_component/logo-upload";
import MobileBackgroundUpload from "./_component/mobile-background-upload";

export default function ThemeSettingsPage() {
  return (
    <div className="flex w-full flex-col items-start justify-start gap-4 rounded-md bg-background p-4">
      <BannerImageUpload />
      <div className="grid w-full grid-cols-2 gap-4">
        <IconUpload />
        <LogoUpload />
      </div>
      <MobileBackgroundUpload />
    </div>
  );
}
