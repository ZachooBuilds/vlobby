
import Link from "next/link";
import { UnderConstructionImage } from "../../../lib/icons/icons";
import { Button } from "@repo/ui/components/ui/button";
import { Badge } from "@tremor/react";

interface UnderConstructionMessageProps {
  badgeText?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
}

/**
 * UnderConstructionMessage Component
 *
 * This component displays a customizable "Under Construction" message with an image,
 * title, description, and a button link.
 *
 * @component
 * @example
 * ```jsx
 * <UnderConstructionMessage
 *   badgeText="Coming Soon"
 *   title="New Features on the Way"
 *   description="We're adding exciting new capabilities to enhance your experience."
 *   buttonText="Back to Home"
 *   buttonLink="/"
 * />
 * ```
 */
export default function UnderConstructionMessage({
  badgeText = "Under Construction",
  title = "Exciting New Experience",
  description = "We are working hard to bring you something amazing. Stay tuned!",
  buttonText = "To Dashboard",
  buttonLink = "/admin/dashboard"
}: UnderConstructionMessageProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <div className="space-y-4 text-center">
        <Badge color="purple" size="xs">{badgeText}</Badge>
        <h1 className="text-3xl font-semibold tracking-tighter sm:text-lg md:text-xl">
          {title}
        </h1>
        <p className="text-muted-foreground">
          {description}
        </p>
      </div>
      <UnderConstructionImage />
      <Link href={buttonLink}>
        <Button variant="secondary">{buttonText}</Button>
      </Link>
    </div>
  );
}
