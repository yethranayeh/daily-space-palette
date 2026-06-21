import type { VariantProps } from "class-variance-authority";

import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/app/lib/utils";

const alertVariants = cva("flex w-full gap-3 rounded-ui-md border px-4 py-3.5", {
  variants: {
    variant: {
      default: "bg-surface-inset border-line text-ink",
      destructive: "bg-destructive/10 border-destructive/30 text-destructive",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return <div role="alert" className={cn(alertVariants({ variant }), className)} {...props} />;
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("text-sm font-medium tracking-tight", className)} {...props} />;
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("text-[12.5px] leading-relaxed text-ink-muted", className)} {...props} />
  );
}

export { Alert, AlertTitle, AlertDescription };
