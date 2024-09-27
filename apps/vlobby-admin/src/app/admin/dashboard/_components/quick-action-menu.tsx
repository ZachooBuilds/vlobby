import Link from "next/link";
import { quickActionMenuItems } from "../../../lib/app-data/static-data";
import { QuickActionMenuItem } from "../../../lib/app-data/app-types";

/**
 * QuickActionMenu Component
 * 
 * This component renders a grid of quick action items for the admin dashboard.
 * It provides easy access to frequently used actions.
 *
 * @returns {JSX.Element} The rendered QuickActionMenu component
 */
export default function QuickActionMenu() {
  return (
    <div className="flex w-full flex-col gap-2 rounded-sm bg-background p-4">
      {quickActionMenuItems.map((item, index) => (
        <QuickActionItem key={index} {...item} />
      ))}
    </div>
  );
}

/**
 * QuickActionItem Component
 * 
 * This component renders a single quick action item as a link.
 * It displays an icon, name, and description for each action.
 *
 * @param {Object} props - The component props
 * @param {string} props.name - The name of the quick action
 * @param {string} props.href - The URL path for the action
 * @param {React.ComponentType<React.SVGProps<SVGSVGElement>>} props.icon - The icon component for the action
 * @param {string} props.description - A brief description of the action
 * @returns {JSX.Element} The rendered QuickActionItem component
 */
function QuickActionItem({
  name,
  href,
  icon: Icon,
  description,
}: QuickActionMenuItem) {
  return (
    <Link href={`/admin/${href}`} className="w-full text-start">
      <div className="group flex items-start gap-4 rounded-md p-4 transition-colors duration-300 hover:bg-muted">
        {/* Icon container with hover effects */}
        <div className="flex min-w-10 items-center justify-center rounded-lg bg-muted p-2 transition-colors duration-300 group-hover:bg-background">
          <svg
            className="h-5 w-5 fill-foreground transition-colors duration-300 group-hover:fill-muted-foreground"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 60 60"
          >
            <Icon />
          </svg>
        </div>
        {/* Text content container */}
        <div className="flex flex-col">
          <div className="text-sm font-medium transition-all duration-300 group-hover:font-semibold">
            {name}
          </div>
          <div className="text-xs text-muted-foreground">{description}</div>
        </div>
      </div>
    </Link>
  );
}
