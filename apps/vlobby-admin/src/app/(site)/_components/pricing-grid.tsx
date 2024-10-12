"use client";
import React, { useState } from "react";
import { Container } from "./container";
import { IconCheck } from "@tabler/icons-react";
import { CustomLink } from "./custom-link";
import { Button } from "./button";
import { cn } from '@repo/ui/lib/utils';
import Balancer from "react-wrap-balancer";
import Beam from "./beam";
import { Switch } from "./switch";
import { Clients } from "./clients";

export const PricingGrid = () => {
  const tiers = [
    {
      title: "Hobby",
      description: "For individuals trying out the product",
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        "Access to all tools for 14 days",
        "No credit card required",
        "Community Support",
        <span key="access">
          Access to{" "}
          <CustomLink href="https://ui.aceternity.com">
            Aceternity UI
          </CustomLink>
        </span>,
      ],
      onClick: () => {
        console.log("clicked");
      },
      ctaText: "Get Started",
    },
    {
      title: "Starter",
      description: "For serious founders",
      monthlyPrice: 20,
      yearlyPrice: 100,
      features: [
        "Everything in Hobby +",
        "Access to Proactiv AI",
        "Priority tools access",
        <span key="access">
          Support for{" "}
          <CustomLink href="https://algochurn.com">Slack</CustomLink> and{" "}
          <CustomLink href="https://twitter.com/mannupaaji">Twitter</CustomLink>
        </span>,
        "Priority support",
        "99.67% Uptime SLA",
        <span key="access">
          Access to{" "}
          <CustomLink href="https://ui.aceternity.com/templates">
            Aceternity UI Templates
          </CustomLink>
        </span>,
      ],
      onClick: () => {
        console.log("clicked");
      },
      ctaText: "Get Started",
    },
    {
      title: "Pro",
      description: "For small to large businesses",
      monthlyPrice: 30,
      yearlyPrice: 150,
      features: [
        "Everything in Starter + ",
        "Access to our dev team",
        "Coffee with the CEO",
        <span key="access">
          Access to{" "}
          <CustomLink href="https://ui.aceternity.com">
            Aceternity UI
          </CustomLink>
        </span>,
        "Request tools",
        "Advanced analytics",
        "Customizable dashboards",
        "24/7 customer support",
        "Unlimited data storage",
        "Enhanced security features",
      ],
      featured: true,
      onClick: () => {
        console.log("clicked");
      },
      ctaText: "Get Started",
    },
    {
      title: "Enterprise",
      description: "For large scale businesses",
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        "Everything in Pro + ",
        "HIPAA and SOC2 compliance",
        "Bulk email support",
        "Customizable dashboards",
        "24/7 customer support",
      ],
      onClick: () => {
        console.log("clicked");
      },
      ctaText: "Book a demo",
    },
  ];
  const [checked, setChecked] = useState(false);
  return (
    <div>
      <div className="flex justify-center">
        <Switch checked={checked} setChecked={setChecked} />
      </div>
      <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-4 py-20">
        {tiers.map((tier, index) => (
          <div
            key={tier.title + index}
            className={cn(
              "flex flex-col justify-between items-start px-6 py-4 rounded-lg relative overflow-hidden",
              tier.featured &&
                "bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-neutral-900 to-neutral-950"
            )}
          >
            {tier.featured && <Beam showBeam className="top-0 block" />}
            <div>
              <h3 className="text-base font-normal">{tier.title}</h3>
              <p className="text-lg text-neutral-400 mt-4 font-medium">
                {tier.title === "Enterprise"
                  ? "Custom"
                  : `$${checked ? tier.yearlyPrice : tier.monthlyPrice} / ${
                      checked ? "year" : "month"
                    }`}
              </p>
              <p className="text-sm text-neutral-4000 mt-4">
                {tier.description}
              </p>
              <div className="mt-4">
                {tier.features.map((feature, idx) => (
                  <Step key={`feature-${index}-${idx}`}>{feature}</Step>
                ))}
              </div>
            </div>
            <Button
              variant={tier.featured ? "primary" : "muted"}
              onClick={tier.onClick}
              className="mt-4"
            >
              {tier.ctaText}
            </Button>
          </div>
        ))}
      </Container>
      <Clients />
    </div>
  );
};

const Step = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex gap-2 items-start my-4">
      <IconCheck className="h-4 w-4 text-neutral-300 mt-0.5" />
      <div className="text-sm text-neutral-400">
        <Balancer>{children}</Balancer>
      </div>
    </div>
  );
};
