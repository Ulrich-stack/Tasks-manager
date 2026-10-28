"use client";

import Link from "next/link";
import React, { useState } from "react";

import {
  QueueListIcon,
  CheckCircleIcon,
  CalendarIcon,
  Squares2X2Icon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/solid";
import { usePathname } from "next/navigation";

const NavLinks = [
  {
    name: "Tasks",
    href: "/",
    icon: QueueListIcon,
  },
  {
    name: "Categories",
    href: "/categories",
    icon: Squares2X2Icon,
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
    <aside className="md:w-60 md:h-full shrink-0 bg-white border-b md:border-b-0 md:border-r border-slate-200 px-4 py-3 md:py-6">
      <div className="flex justify-between items-center">
        <Link href="/" className="flex items-center gap-x-2 rounded-lg">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-white">
            <CheckIcon className="w-5" aria-hidden="true" />
          </span>
          <span className="font-bold text-lg tracking-tight">Tasks</span>
        </Link>
        <button
          type="button"
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label={showSideBar ? "Close menu" : "Open menu"}
          aria-expanded={showSideBar}
          aria-controls="main-nav"
          onClick={() => setShowSideBar(!showSideBar)}
        >
          {showSideBar ? (
            <XMarkIcon className="w-6" aria-hidden="true" />
          ) : (
            <Bars3Icon className="w-6" aria-hidden="true" />
          )}
        </button>
      </div>
      <nav
        id="main-nav"
        className={`md:flex md:flex-col gap-1 md:mt-8 transition-all duration-300 ease-out overflow-hidden ${
          showSideBar ? "max-h-96 mt-3" : "max-md:max-h-0"
        }`}
      >
        {NavLinks.map((NavLink) => {
          const isActive = NavLink.href === pathname;
          return (
            <Link
              key={NavLink.name}
              href={NavLink.href}
              aria-current={isActive ? "page" : undefined}
              onClick={() => setShowSideBar(false)}
              className={`flex w-full items-center gap-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary-soft text-primary font-semibold"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <NavLink.icon className="w-5" aria-hidden="true" />
              <span>{NavLink.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sibebar;
