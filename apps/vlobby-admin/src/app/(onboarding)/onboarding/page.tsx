import OnboardingBar from "../onboarding-bar";
import OnboardingForm from "./_forms/onboarding-form";

/**
 * OnboardingPage Component
 * 
 * This component renders the main onboarding page for the application.
 * It includes the OnboardingBar and OnboardingForm components.
 *
 * @returns {JSX.Element} The rendered OnboardingPage component
 */
export default function OnboardingPage() {
  return (
    <main className="flex h-full w-full flex-col items-center justify-start overflow-scroll rounded-md">
      {/* OnboardingBar: Displays the top bar with logo and user controls */}
      <OnboardingBar />
      <div className="flex h-full w-full flex-col items-center justify-start rounded-md p-10 md:pl-28 md:pr-28">
        {/* OnboardingForm: Renders the main onboarding form */}
        <OnboardingForm />
      </div>
    </main>
  );
}
