import { cn } from "@/lib/utils";
import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("card bg-base-100 shadow-xl border border-base-300", className)}
        {...props}
    />
));
Card.displayName = "Card";

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("card-body pb-2", className)} {...props} />
    )
);
CardHeader.displayName = "CardHeader";

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    children: React.ReactNode;
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
    ({ className, children, ...props }, ref) => (
        <h2 ref={ref} className={cn("card-title text-lg font-semibold", className)} {...props}>
            {children}
        </h2>
    )
);
CardTitle.displayName = "CardTitle";

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
    ({ className, ...props }, ref) => (
        <p ref={ref} className={cn("text-base-content/70 text-sm", className)} {...props} />
    )
);
CardDescription.displayName = "CardDescription";

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("px-6 pb-2", className)} {...props} />
    )
);
CardContent.displayName = "CardContent";

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("card-actions justify-end p-6 pt-2", className)} {...props} />
    )
);
CardFooter.displayName = "CardFooter";

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
