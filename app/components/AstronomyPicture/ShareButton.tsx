"use client";

import { useState } from "react";
import { Check, Share } from "lucide-react";

import { toast } from "@/app/hooks/use-toast";
import { SITE_URL } from "@/app/lib/site";
import { Button } from "@/app/components/ui/button";

export function ShareButton({ date }: { date: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = `${SITE_URL}/${date}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({ title: "Link copied!", description: `${url} copied to clipboard.`, duration: 2000 });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Copy failed",
        description: "Could not copy link to clipboard.",
        duration: 2000,
      });
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleShare}
      className="font-mono text-[10px] tracking-[0.16em] uppercase px-3 py-1 rounded-full h-auto gap-1 border-line-strong hover:border-accent hover:text-accent w-[90px]"
    >
      {copied ? <Check size={10} /> : <Share size={10} />}
      {copied ? "Copied" : "Share"}
    </Button>
  );
}
