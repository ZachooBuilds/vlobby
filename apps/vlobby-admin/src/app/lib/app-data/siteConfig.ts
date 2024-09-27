export const siteConfig = {
  name: "Dashboard",
  url: "https://dashboard.tremor.so",
  description: "The only dashboard you will ever need.",
  baseLinks: {
    home: "/",
    overview: "/overview",
    details: "/details",
    settings: {
      general: "/settings/general",
      billing: "/settings/billing",
      users: "/settings/users",
    },
  },
  onboardingSteps: [
    "1. Choose Domain",
    "2. Add Property/Project",
    "3. Complete 🎉",
  ],
};

export type siteConfig = typeof siteConfig;
