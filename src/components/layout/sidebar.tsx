import {
  Home,
  LogOut,
  Menu,
  Package,
  Package2,
  Users2,
  BadgeDollarSign,
  BookUser,
  PanelLeft,
  LineChart,
  Search,
  Image,
  DollarSign,
} from "lucide-react";
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
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Input } from "../ui/input";
import { DropdownMenu, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { toast } from "react-toastify";

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
      toast.success("logout successfully");
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
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-gray-900 text-white sm:flex">
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
              <TooltipTrigger className="hover:text-white" asChild>
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
              <TooltipTrigger className="hover:text-white" asChild>
                <Link href="/categories" className={linkClasses("/categories")}>
                  <Menu className="h-5 w-5 hover:text-white" />
                  <span className="sr-only">Categories</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Categories</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="hover:text-white" asChild>
                <Link href="/products" className={linkClasses("/products")}>
                  <Package className="h-5 w-5 hover:text-white" />
                  <span className="sr-only">Products</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Products</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="hover:text-white" asChild>
                <Link href="/invoices" className={linkClasses("/invoices")}>
                  <BadgeDollarSign className="h-5 w-5 hover:text-white" />
                  <span className="sr-only">Invoices</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Invoices</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="hover:text-white" asChild>
                <Link href="/supplier" className={linkClasses("/supplier")}>
                  <BookUser className="h-5 w-5 hover:text-white" />
                  <span className="sr-only">Suppliers</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Suppliers</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="hover:text-white" asChild>
                <Link href="/customers" className={linkClasses("/customers")}>
                  <Users2 className="h-5 w-5 hover:text-white" />
                  <span className="sr-only">Customers</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Customers</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="hover:text-white" asChild>
                <button
                  onClick={handleLogout}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <LogOut className="h-5 w-5 hover:text-white" />
                  <span className="sr-only">Logout</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Logout</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="sm:hidden">
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-xs">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="#"
                className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
              >
                <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                <span className="sr-only">Acme Inc</span>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <Home className="h-5 w-5" />
                Dashboard
              </Link>
              <Link
                href="/categories"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <Menu className="h-5 w-5" />
                Categories
              </Link>
              <Link
                href="/products"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <Package className="h-5 w-5" />
                Products
              </Link>
              <Link
                href="/invoices"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <DollarSign className="h-5 w-5" />
                Invoices
              </Link>
              <Link
                href="/supplier"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <BookUser className="h-5 w-5" />
                Suppliers
              </Link>
              <Link
                href="/customers"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <Users2 className="h-5 w-5" />
                Customers
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-4 px-2.5 bottom-5 absolute text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </nav>
          </SheetContent>
        </Sheet>
      </header>
    </div>
  );
};

export default Sidebar;
