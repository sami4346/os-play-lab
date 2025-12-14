import React from 'react';
import { cn } from '@/lib/utils';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

// Heading 1 - Main page titles
export const H1 = ({ children, className }: TypographyProps) => (
  <h1 className={cn(
    "scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl",
    "text-foreground",
    className
  )}>
    {children}
  </h1>
);

// Heading 2 - Section titles
export const H2 = ({ children, className }: TypographyProps) => (
  <h2 className={cn(
    "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
    "text-foreground border-border",
    className
  )}>
    {children}
  </h2>
);

// Heading 3 - Subsection titles
export const H3 = ({ children, className }: TypographyProps) => (
  <h3 className={cn(
    "scroll-m-20 text-2xl font-semibold tracking-tight",
    "text-foreground",
    className
  )}>
    {children}
  </h3>
);

// Heading 4 - Card titles
export const H4 = ({ children, className }: TypographyProps) => (
  <h4 className={cn(
    "scroll-m-20 text-xl font-semibold tracking-tight",
    "text-foreground",
    className
  )}>
    {children}
  </h4>
);

// Body text - Regular paragraphs
export const Body = ({ children, className }: TypographyProps) => (
  <p className={cn(
    "leading-7 [&:not(:first-child)]:mt-6",
    "text-foreground max-w-prose",
    className
  )}>
    {children}
  </p>
);

// Body Large - Emphasized text
export const BodyLarge = ({ children, className }: TypographyProps) => (
  <p className={cn(
    "text-lg leading-relaxed [&:not(:first-child)]:mt-6",
    "text-foreground max-w-prose",
    className
  )}>
    {children}
  </p>
);

// Caption - Small explanatory text
export const Caption = ({ children, className }: TypographyProps) => (
  <p className={cn(
    "text-sm text-muted-foreground",
    className
  )}>
    {children}
  </p>
);

// Lead - Introduction text
export const Lead = ({ children, className }: TypographyProps) => (
  <p className={cn(
    "text-xl text-muted-foreground max-w-prose",
    className
  )}>
    {children}
  </p>
);

// Code - Inline code
export const Code = ({ children, className }: TypographyProps) => (
  <code className={cn(
    "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
    "text-foreground",
    className
  )}>
    {children}
  </code>
);

// Blockquote - Quoted text
export const Blockquote = ({ children, className }: TypographyProps) => (
  <blockquote className={cn(
    "mt-6 border-l-2 pl-6 italic",
    "border-border text-muted-foreground",
    className
  )}>
    {children}
  </blockquote>
);

// List - Unordered list
export const List = ({ children, className }: TypographyProps) => (
  <ul className={cn(
    "my-6 ml-6 list-disc [&>li]:mt-2",
    "text-foreground",
    className
  )}>
    {children}
  </ul>
);

// Ordered List
export const OrderedList = ({ children, className }: TypographyProps) => (
  <ol className={cn(
    "my-6 ml-6 list-decimal [&>li]:mt-2",
    "text-foreground",
    className
  )}>
    {children}
  </ol>
);

// Muted text - De-emphasized text
export const Muted = ({ children, className }: TypographyProps) => (
  <p className={cn(
    "text-sm text-muted-foreground",
    className
  )}>
    {children}
  </p>
);

// Small text - Fine print
export const Small = ({ children, className }: TypographyProps) => (
  <small className={cn(
    "text-xs font-medium leading-none",
    "text-muted-foreground",
    className
  )}>
    {children}
  </small>
);

// Export as object for easier usage
const Typography = {
  H1,
  H2,
  H3,
  H4,
  Body,
  BodyLarge,
  Caption,
  Lead,
  Code,
  Blockquote,
  List,
  OrderedList,
  Muted,
  Small,
};

export default Typography;
