import { cn } from "@/lib/utils";
import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?:
        | "default"
        | "primary"
        | "secondary"
        | "accent"
        | "info"
        | "success"
        | "warning"
        | "error";
    size?: "sm" | "md" | "lg";
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, variant = "default", size = "md", ...props }, ref) => {
        const sizeClasses = {
            sm: "px-2 py-1 text-xs",
            md: "px-2.5 py-1.5 text-sm",
            lg: "px-3 py-2 text-base",
        };

        const variantClasses = {
            default: "bg-base-200 text-base-content",
            primary: "bg-primary text-primary-content",
            secondary: "bg-secondary text-secondary-content",
            accent: "bg-accent text-accent-content",
            info: "bg-info text-info-content",
            success: "bg-success text-success-content",
            warning: "bg-warning text-warning-content",
            error: "bg-error text-error-content",
        };

        return (
            <span
                ref={ref}
                className={cn(
                    "inline-flex items-center rounded-full font-medium",
                    sizeClasses[size],
                    variantClasses[variant],
                    className
                )}
                {...props}
            />
        );
    }
);

Badge.displayName = "Badge";

export { Badge };
