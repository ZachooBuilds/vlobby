import Link, { LinkProps } from "next/link";

interface CustomLinkProps {
  href: string;
  children?: React.ReactNode; // Ensure children is part of the props
}

export const CustomLink = (props: CustomLinkProps) => {
  return (
    <Link
      className="text-neutral-400 hover:text-white border-b-[1px] border-neutral-400 pb-0.5 hover:border-white  transition duration-200"
      {...props}
    >
      {props.children}
    </Link>
  );
};
