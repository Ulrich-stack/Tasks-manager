"use client";

import Link from "next/link";
import React, { useState } from "react";

import {
  QueueListIcon,
  CheckCircleIcon,
  CalendarIcon,
  CircleStackIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

const NavLinks = [
  {
    name: "Tasks",
    href: "/",
    icon: QueueListIcon,
  },
  {
    name: "Categories",
    href: "/categories",
    icon: CircleStackIcon,
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
  const [showSideBar, setShowSideBar] = useState(false);

  return (
    <div className=" md:w-56 bg-white w-full h-full p-4 sticky">
      <div className="w-full flex justify-between items-center">
        <h3 className="md:mt-4 font-bold text-xl">ToDo</h3>
        <Bars3Icon
          className={`w-5 md:hidden hover:cursor-pointer ${
            showSideBar && "hidden"
          }`}
          onClick={() => setShowSideBar(true)}
        />
        {showSideBar && (
          <XMarkIcon
            className="w-5 md:hidden hover:cursor-pointer"
            onClick={() => setShowSideBar(false)}
          />
        )}
      </div>
      <div
        className={`md:flex md:flex-col gap-2 mt-3 transition-all duration-500 ease-in-out ${
          !showSideBar ? "max-md:max-h-0 overflow-hidden" : "max-h-[1000px]"
        }`}
      >
        {NavLinks.map((NavLink) => {
          return (
            <Link
              key={NavLink.name}
              href={NavLink.href}
              className={`text-xs flex w-full p-2 items-center rounded-sm ${
                NavLink.href === pathname && "bg-[#edeced]"
              }`}
            >
              <NavLink.icon className="w-4 mr-1" />
              <p>{NavLink.name}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Sibebar;
