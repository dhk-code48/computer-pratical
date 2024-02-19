import { UserButton } from "@/components/user-button";
import { MobileSidebar } from "./mobile-sidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SelectActiveBatch from "@/components/select-active-batch";
import { db } from "@/lib/db";

export const Navbar = async () => {
  const session = await auth();
  // const batchs = await db.batch.findMany({});

  // const activeBatch = batchs.filter((batch) => batch.isActive)[0];

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <MobileSidebar />
      <div className="flex justify-end w-full">
        {/*<div className="w-full flex-1">
          <SelectActiveBatch batchs={batchs} activeBatch={activeBatch} />
  </div>*/}
        <UserButton email={session.user.email} userName={session.user.name} />
      </div>
    </div>
  );
};
