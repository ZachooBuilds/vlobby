
import { Metadata } from "next";
import { AmbientColor } from "../../_components/ambient-color";
import { ContactForm } from "../../_components/contact-form";

export const metadata: Metadata = {
  title: "Contact | Proactiv | Aceternity Templates",
  description:
    "Proactiv is an all in on marketing automation platform that handles emails, tasks tracking, social media management and everything in between.",
  openGraph: {
    images: ["https://proactiv-aceternity.vercel.app/banner.png"],
  },
};

export default function ContactPage() {
  return (
    <div className="relative overflow-hidden">
      {/* <AmbientColor />
      <ContactForm /> */}
    </div>
  );
}
