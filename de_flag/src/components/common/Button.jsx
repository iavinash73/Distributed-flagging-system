import { cn } from "../../utils/cn";
import { VariantProps, cva } from "class-variance-authority";
import { ButtonHTMLAttributes, forwardRef } from "react";

const buttonVariants = cva("inline-flex items-center rounded-md text-[24px]", {
  variants: {
    variant: {
      default: "border-[1.5px] border-black text-[18px] hover:bg-[#085AAB] hover:border-black hover:text-white duration-[300ms]",
      black: "flex items-center justify-center border-[1.5px] border-black text-white bg-black text-[16px] hover:bg-[#085AAB] hover:border-black hover:text-white duration-[300ms] disabled:bg-slate-400 disabled:text-black disabled:hover:cursor-not-allowed",
    },
    size: {
      default: "h-[35px] px-3 py-1 rounded-md",
      sm: "px-4 rounded-md",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const Button = (
  ({ className, size, variant, children, ...props }, ref) => {
    return (
      <button
        // ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {children}
      </button>
    );
  }
);

export { Button, buttonVariants };
