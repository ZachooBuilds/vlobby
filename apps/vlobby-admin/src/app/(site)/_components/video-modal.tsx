"use client";


import { useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa6";
import ReactPlayer from "react-player";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

export function VideoModal() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="md:h-32 md:w-32 h-16 w-16 bg-black/50  rounded-full backdrop-blur-sm flex items-center justify-center">
          <FaPlay className="md:h-10 md:w-10 h-6 w-6 text-white " />
        </div>
      </DialogTrigger>
      <DialogContent className="h-[50vh] w-[90vw] md:h-[90vh] md:w-[90vw]  max-w-none border-none">
        <ReactPlayer
          url="https://www.youtube.com/watch?v=dC1yHLp9bWA" // Don't talk about it.
          width="90%"
          height={isMobile ? "100%" : "100%"}
          style={{
            margin: "auto",
          }}
          controls
        />
      </DialogContent>
    </Dialog>
  );
}
