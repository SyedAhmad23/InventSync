import { Home, LogOut, Menu, Package, Package2, Users2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLogoutMutation } from "@/feature/auth/authApi";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeLink, setActiveLink] = useState<string>(pathname);
  const [logout] = useLogoutMutation();
  useEffect(() => {
    setActiveLink(pathname);
  }, [pathname]);
  const handleLogout = async () => {
    try {
      await logout().unwrap();
      router.push("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };
  const linkClasses = (path: string) =>
    `flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8 ${
      activeLink === path
        ? "text-foreground bg-accent"
        : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <div>
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="#"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/dashboard" className={linkClasses("/dashboard")}>
                  <Home className="h-5 w-5" />
                  <span className="sr-only">Dashboard</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Dashboard</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/categories" className={linkClasses("/categories")}>
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Categories</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Categories</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/products" className={linkClasses("/products")}>
                  <Package className="h-5 w-5" />
                  <span className="sr-only">Products</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Products</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/invoices" className={linkClasses("/invoices")}>
                  <Users2 className="h-5 w-5" />
                  <span className="sr-only">Invoices</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Invoices</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/supplier" className={linkClasses("/suppliers")}>
                  <Users2 className="h-5 w-5" />
                  <span className="sr-only">Suppliers</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Suppliers</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleLogout}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="sr-only">Logout</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Logout</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
