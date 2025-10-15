import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-bold text-sm tracking-wide uppercase transition-all duration-300 overflow-hidden group disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: [
          "bg-gradient-to-b from-amber-400 via-yellow-500 to-amber-600",
          "text-amber-900 shadow-lg shadow-amber-500/25 rounded-lg",
          "border-2 border-amber-300",
          "hover:from-amber-300 hover:via-yellow-400 hover:to-amber-500",
          "hover:shadow-xl hover:shadow-amber-500/40 hover:scale-105",
          "active:scale-95 active:shadow-md",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:-translate-x-full before:transition-transform before:duration-700 hover:before:translate-x-full"
        ],
        destructive: [
          "bg-gradient-to-b from-red-500 via-orange-600 to-red-700",
          "text-white shadow-lg shadow-red-500/25 rounded-lg",
          "border-2 border-orange-300",
          "hover:from-red-400 hover:via-orange-500 hover:to-red-600",
          "hover:shadow-xl hover:shadow-red-500/40 hover:scale-105",
          "active:scale-95 active:shadow-md"
        ],
        outline: [
          "bg-transparent border-2 border-amber-400 rounded-lg",
          "text-amber-400 hover:bg-amber-400 hover:text-amber-900",
          "hover:shadow-lg hover:shadow-amber-500/25 hover:scale-105",
          "active:scale-95"
        ],
        secondary: [
          "bg-gradient-to-b from-blue-500 via-cyan-600 to-blue-700",
          "text-white shadow-lg shadow-blue-500/25 rounded-lg",
          "border-2 border-cyan-300",
          "hover:from-blue-400 hover:via-cyan-500 hover:to-blue-600",
          "hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105",
          "active:scale-95 active:shadow-md"
        ],
        ghost: [
          "bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900",
          "text-slate-200 border-2 border-slate-600 rounded-lg",
          "hover:from-slate-600 hover:via-slate-700 hover:to-slate-800",
          "hover:text-white hover:border-slate-500 hover:scale-105",
          "active:scale-95"
        ],
        link: "text-primary underline-offset-4 hover:underline rounded-lg",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 py-1 text-xs",
        lg: "h-12 px-6 py-3 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
