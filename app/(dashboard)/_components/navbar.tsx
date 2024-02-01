import { UserButton } from "@/components/user-button";
import { MobileSidebar } from "./mobile-sidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const Navbar = async () => {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <MobileSidebar />
      <div className="flex justify-end w-full">
        <UserButton email={session.user.email} userName={session.user.name} />
      </div>
    </div>
  );
};
