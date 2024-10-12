"use client";
import Image from "next/image";
import React, { useState } from "react";
import Marquee from "react-fast-marquee";
import { BlurImage } from "./blur-image";

export const Clients = () => {
  let [logos, setLogos] = useState([
    {
      title: "netflix",
      src: "/logos/netflix.png",
    },
    {
      title: "google",
      src: "/logos/google.webp",
    },
    {
      title: "meta",
      src: "/logos/meta.png",
    },
    {
      title: "onlyfans",
      src: "/logos/onlyfans.png",
    },
    {
      title: "netflix second",
      src: "/logos/netflix.png",
    },
    {
      title: "google second",
      src: "/logos/google.webp",
    },
    {
      title: "meta second",
      src: "/logos/meta.png",
    },
    {
      title: "onlyfans second",
      src: "/logos/onlyfans.png",
    },
  ]);
  return (
    <div className="pt-20 pb-40 h-40">
      <p className="text-neutral-400 text-center mb-4">
        Trusted by big industries
      </p>
      <div className="flex justify-center gap-4 max-w-7xl mx-auto relative">
        <div className="absolute inset-0 bg-charcoal grayscale z-40 pointer-events-none [mask-image:_radial-gradient(circle,_transparent_10%,_#000000_100%)]" />
        <Marquee>
          {logos.map((logo, idx) => (
            <BlurImage
              key={logo.title + idx}
              src={logo.src}
              alt={logo.title}
              width={100}
              height={100}
              className=" mx-8 object-contain grayscale hover:grayscale-0 transition duration-200"
            />
          ))}
        </Marquee>
      </div>
    </div>
  );
};
