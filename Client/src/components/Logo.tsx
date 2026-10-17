import { cn } from "@/lib/utils";
import logoFull from "@/assets/logo.png";
import logoIcon from "@/assets/logo-icon.png";

type LogoProps = {
  variant?: "icon" | "full";
  className?: string;
};

export function Logo({ variant = "icon", className }: LogoProps) {
  if (variant === "full") {
    return <img src={logoFull} alt="Nosh - meal planning platform" className={cn("h-auto w-64", className)} />;
  }
  return <img src={logoIcon} alt="Nosh" className={cn("h-10 w-auto", className)} />;
}
