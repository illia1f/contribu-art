import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  /**
   * Size of the logo in pixels. Defaults to 32px.
   */
  size?: number;
  /**
   * Additional CSS classes to apply to the container
   */
  className?: string;
  /**
   * Whether to show the logo with text label. Defaults to false.
   */
  withText?: boolean;
}

export function Logo({ size = 32, className, withText = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className="relative flex-shrink-0"
        style={{ width: size, height: size }}
      >
        <Image
          src="/contribu-art-logo-tp.png"
          alt="Contribu-Art Logo"
          width={size}
          height={size}
          className="object-contain"
          priority
        />
      </div>
      {withText && (
        <h1 className="text-xl font-bold text-text tracking-tight">
          Contribu-Art
        </h1>
      )}
    </div>
  );
}

