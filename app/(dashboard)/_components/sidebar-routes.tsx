"use client";

import {
  BarChart,
  Compass,
  Layout,
  Backpack,
  School,
  User,
  Users,
  Calendar,
} from "lucide-react";
import { usePathname } from "next/navigation";

import { SidebarItem } from "./sidebar-item";
import path from "path";

const guestRoutes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: Compass,
    label: "Worksheets",
    href: "/worksheets",
  },
];

const teacherRoutes = [
  {
    icon: Backpack,
    label: "Sections",
    href: "/teacher/sections",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/teacher/analytics",
  },
];
const superAdminRoutes = [
  {
    icon: School,
    label: "Grades",
    href: "/superadmin/grades",
  },
  {
    icon: User,
    label: "Teachers",
    href: "/superadmin/teachers",
  },
  {
    icon: Users,
    label: "Students",
    href: "/superadmin/students",
  },
  {
    icon: Calendar,
    label: "Batch",
    href: "/superadmin/batches",
  },
];

export const SidebarRoutes = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.includes("/teacher");
  const isSuperAdminPage = pathname?.includes("/superadmin");

  const routes = isSuperAdminPage
    ? superAdminRoutes
    : isTeacherPage
    ? teacherRoutes
    : guestRoutes;

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};
