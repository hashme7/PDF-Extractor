import { cn } from "../utils/index";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className }: CardProps) => (
  <div className={cn("rounded-lg shadow-lg", className)}>{children}</div>
);
