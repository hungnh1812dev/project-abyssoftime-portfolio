"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";

import localAvatar from "@/images/avatar.jpg";

import type { CvContact } from "../cv.types";

export interface CvHeaderProps {
  avartar?: CvContact["avatar"];
  children?: React.ReactNode;
}

export const CvHeaderClient = ({ avartar, children }: CvHeaderProps) => {
  const searchParams = useSearchParams();
  const hideAvatar = searchParams.get("n") === "1";
  return (
    <header className="mb-4 flex items-center gap-5 border-b border-border/40 pb-4 sm:gap-6">
      {!hideAvatar && (
        <Image
          src={avartar?.url || localAvatar.src}
          alt="Profile Avatar"
          width={96}
          height={96}
          className="h-20 w-20 shrink-0 rounded-full border-2 border-blue-600/50 object-cover sm:h-24 sm:w-24"
        />
      )}
      <div className={`group min-w-0 flex-1 ${hideAvatar ? "text-center" : ""}`}>
        {children}
      </div>
    </header>
  );
};
