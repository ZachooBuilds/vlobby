"use client";
import React, { useState } from "react";
import { Container } from "./container";
import { Logo } from "./logo";
import {
  IconBrandGithub,
  IconBrandGithubFilled,
  IconBrandGoogleFilled,
} from "@tabler/icons-react";
import { Button } from "./button";

import { motion } from "framer-motion";

export const Register = () => {
  const [isClicked, setIsClicked] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    const target = e.target as HTMLInputElement; // Typecasting to HTMLInputElement
    console.log(target.value);
  };
  return (
    <Container className="h-screen max-w-lg mx-auto flex flex-col items-center justify-center">
      <Logo />
      <h1 className="text-xl md:text-4xl font-bold my-4">
        Welcome to Proactiv
      </h1>

      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <button className="flex flex-1 justify-center space-x-2 items-center bg-white px-4 py-3 rounded-md text-black hover:bg-white/80 transition duration-200 shadow-[0px_1px_0px_0px_#00000040_inset]">
          <IconBrandGithubFilled className="h-4 w-4 text-black" />
          <span className="text-sm">Login with GitHub</span>
        </button>
        <button className="flex flex-1 justify-center space-x-2 items-center bg-white px-4 py-3 rounded-md text-black hover:bg-white/80 transition duration-200 shadow-[0px_1px_0px_0px_#00000040_inset]">
          <IconBrandGoogleFilled className="h-4 w-4 text-black" />
          <span className="text-sm">Login with Google</span>
        </button>
      </div>

      <div className="h-px bg-neutral-800 w-full my-6" />
      <motion.input
        initial={{
          height: "0px",
          opacity: 0,
          marginBottom: "0px",
        }}
        animate={{
          height: isClicked ? "40px" : "0px",
          opacity: isClicked ? 1 : 0,
          marginBottom: isClicked ? "10px" : "0px",
        }}
        type="email"
        placeholder="contact@aceternity.com"
        className="h-10 pl-4 w-full rounded-md text-sm bg-charcoal border border-neutral-800 text-white placeholder-neutral-500 outline-none focus:outline-none active:outline-none focus:ring-2 focus:ring-neutral-800"
      />
      <Button
        onClick={(e: React.FormEvent<HTMLInputElement>) => {
          if (!isClicked) {
            setIsClicked(true);
            return;
          }
          handleSubmit(e);
        }}
        variant="muted"
        className="w-full py-3"
      >
        <span className="text-sm">Continue with Email</span>
      </Button>
    </Container>
  );
};
