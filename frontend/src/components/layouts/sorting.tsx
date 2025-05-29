"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

const sortOptions = {
  relevance: "Relevance",
  trending: "Trending",
  latest: "Latest arrivals",
  "low-to-high": "Price: Low to high",
  "high-to-low": "Price: High to low",
};

const SortList = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedSort = searchParams.get("sort") || "relevance";

  const handleSortChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("sort", value);
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, searchParams, pathname]
  );

  return (
    <div className="w-full lg:w-2/12 p-4">
      <h2 className="text-muted-foreground text-xs mb-2">Sort by</h2>
      <ul className="space-y-2">
        {Object.entries(sortOptions).map(([value, label]) => (
          <li
            key={value}
            onClick={() => handleSortChange(value)}
            className={`text-sm cursor-pointer text-black-400 ${
              selectedSort === value
                ? "underline"
                : "hover:underline"
            }`}
          >
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SortList;
