import { ChevronLeft, ChevronRight, Search } from "lucide-react";

interface OnboardingBarProps {
  url: string;
}

export default function WindowSearchPreview({ url }: OnboardingBarProps) {
  return (
    <div className="flex min-h-[300px] w-full flex-col rounded-md shadow-tremor-card">
      <div className=" flex  flex-row items-center gap-2 rounded-t-md bg-muted pl-5 pt-2">
        <div className="h-4 w-4 rounded-full bg-red-500"></div>
        <div className="h-4 w-4 rounded-full bg-yellow-500"></div>
        <div className="h-4 w-4 rounded-full bg-green-500"></div>
        <div className="flex h-full w-full flex-col justify-end pl-4">
          <div className="h-[30px] w-[130px] rounded-t-md bg-background"></div>
        </div>
      </div>
      <div className="flex flex-row items-center gap-2 bg-background p-2">
        <ChevronLeft />
        <ChevronRight />
        <div className="flex h-full w-full flex-row items-center gap-2 rounded-sm bg-muted pb-1 pl-2 pt-1">
          <Search className="h-4 w-4" />
          <p>{`www.${url}.vlobby.co.nz`}</p>
        </div>
      </div>
      <div className="flex h-full flex-row items-center gap-2 p-2"></div>
    </div>
  );
}
