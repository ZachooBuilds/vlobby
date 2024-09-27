import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SettingsNavigation from "./_components/settings-navigation";
import SettingsBanner from "./_components/settings-cover";
import { siteConfig } from "../../lib/app-data/siteConfig";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yoururl.com"),
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: [],
  authors: [
    {
      name: "yourname",
      url: "",
    },
  ],
  creator: "yourname",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col items-start justify-start gap-2">
      <SettingsBanner />
      <SettingsNavigation />
      <div className="flex w-full">{children}</div>
    </div>
  );
}