import Link from "next/link";
import { COLORS } from "./constants";
import { NavItem } from "./types.";
type NavLinkProps = NavItem & { className?: string };

export default function NavLink({
  label,
  href,
  isButton,
  hasSeparator,
  className,
}: NavLinkProps): JSX.Element {
  const defaultClassName = `flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md ${
    isButton
      ? "bg-neutral-800 text-neutral-100 hover:bg-neutral-700"
      : "text-neutral-300 hover:bg-neutral-800 hover:text-neutral-100"
  } ${hasSeparator ? COLORS.HAS_SEPARATOR : ""}`;

  return (
    <Link href={href} className={`${defaultClassName} ${className || ''}`}>
      {label}
    </Link>
  );
}
