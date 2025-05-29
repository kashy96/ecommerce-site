"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";

const LeftSidebar = ({ updatedCategories }: { updatedCategories: Category[] }) => {
  const pathname = usePathname();
  return (
    <div className="w-full lg:w-2/12 p-4">
      <h2 className="text-muted-foreground text-xs mb-2">Collections</h2>
      <ul className="space-y-4">
        {updatedCategories.map((category: Category) => (
           <Link
                key={category._id}
                href={category.slug === "all" ? "/" : `/search/${category.slug}`}
            >
        
            <li
              className={`text-black-400 text-sm hover:underline cursor-pointer py-1 ${
                (pathname === `/search/${category.slug}` ? "underline" : "") || (pathname === "/" && category.slug === "all")
                ? "underline"
                : ""
              }`}
            >
              {category.name}
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default LeftSidebar;
