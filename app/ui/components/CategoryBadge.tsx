import Image from "next/image";
import { categories } from "@/app/lib/categories";
import {
  hasIcon,
  iconIndex,
  stringToColor,
  stringToTint,
} from "@/app/lib/utils";

export default function CategoryBadge({ category }: { category: string }) {
  return (
    <span
      className="inline-flex items-center gap-x-1.5 px-2 py-0.5 rounded-full text-xs font-medium text-slate-700"
      style={{ backgroundColor: stringToTint(category) }}
    >
      {hasIcon(category) ? (
        <Image
          src={`/icons/${categories[iconIndex(category)].icon}`}
          alt=""
          width={14}
          height={14}
        />
      ) : (
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: stringToColor(category) }}
          aria-hidden="true"
        />
      )}
      {category}
    </span>
  );
}
