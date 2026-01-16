import { cn } from "@/lib/utils";
import { ReactNode } from "react";
interface Props {
  children: ReactNode;
  className?: string;
}
const Title = ({ children, className }: Props) => {
  return (
    <h2 className={cn("text-2xl font-semibold", className)}>{children}</h2>
  );
};

export default Title;
