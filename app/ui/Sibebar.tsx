'use client'

import Link from "next/link";
import React from "react";

import {
  QueueListIcon,
  CheckCircleIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";

const NavLinks = [
  {
    name: "Tasks",
    href: "/",
    icon: QueueListIcon,
  },
  {
    name: "Completed",
    href: "/completed",
    icon: CheckCircleIcon,
  },
  {
    name: "Calendar",
    href: "/calendar",
    icon: CalendarIcon,
  },
];

function Sibebar() {
    const pathname = usePathname();

  return (
    <div className="bg-white h-full p-4">
      <h3 className="mt-5 font-semibold">ToDo</h3>
      <div className="flex flex-col gap-2">
        {NavLinks.map((NavLink) => {
          return (
            <Link key={NavLink.name} href={NavLink.href} className={`text-xs flex w-full p-2 items-center rounded-sm ${NavLink.href === pathname && 'bg-[#edeced]'}`}>
              <NavLink.icon className="w-4 mr-1"/>
              <p>{NavLink.name}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Sibebar;
