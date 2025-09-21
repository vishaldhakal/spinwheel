"use client";
import React, { ReactNode, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, LogOut, Settings, User, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { PrivateRoute } from "@/components/PrivateRoute";
import { useAuth } from "@/components/providers/AuthProvider";

interface AdminLayoutProps {
  children: ReactNode;
}

interface UserType {
  id: number;
  email: string;
  role: string;
  organization: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  };
  phone_number: string | null;
  is_active: boolean;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth() as {
    user: UserType | null;
    logout: () => void;
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const NavLink = ({
    href,
    icon: Icon,
    children,
  }: {
    href: string;
    icon: React.ElementType;
    children: ReactNode;
  }) => (
    <Link
      href={href}
      className={`flex items-center space-x-2 py-3 px-4 text-sm rounded-lg transition-colors ${
        pathname === href
          ? "bg-blue-800 text-white"
          : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
      }`}
      onClick={() => setIsSidebarOpen(false)}
    >
      <Icon size={20} />
      <span>{children}</span>
    </Link>
  );

  const SidebarContent = () => (
    <>
      <div className="p-4">
        <h1 className="text-2xl font-bold text-card-foreground">Admin Panel</h1>
      </div>
      <nav className="flex-1 mt-4 space-y-1 px-2">
        <NavLink href="/admin" icon={Settings}>
          Manage Lucky Draw
        </NavLink>
        <NavLink href="/admin/profile" icon={User}>
          Profile
        </NavLink>
      </nav>
      <Separator className="my-4" />
      {user ? (
        <Button
          variant="ghost"
          className="mx-4 mb-6 justify-start"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      ) : (
        <Button
          variant="ghost"
          className="mx-4 mb-6 justify-start"
          onClick={() => router.push("/login")}
        >
          <LogIn className="mr-2 h-4 w-4" />
          Login
        </Button>
      )}
    </>
  );

  return (
    <PrivateRoute>
      <div className="flex flex-col h-screen bg-background lg:flex-row">
        {/* Mobile sidebar */}
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden fixed top-4 left-4 z-50"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-card">
            <div className="flex flex-col h-full">
              <SidebarContent />
            </div>
          </SheetContent>
        </Sheet>

        {/* Sidebar for larger screens */}
        <aside className="hidden lg:flex flex-col w-64 bg-card border-r">
          <SidebarContent />
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* <header
            className={`bg-card z-20 transition-shadow ${
              isScrolled ? "shadow-md" : ""
            }`}
          >
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-card-foreground hidden lg:block">
                {user?.organization?.name}
              </h1>
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium hidden sm:inline-block">
                        {user.email}
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <a href="/admin/profile">Profile</a>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </header> */}
          <main className="flex-1 overflow-auto bg-background p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
              <div className="bg-card rounded-lg shadow-sm p-4 sm:p-6">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </PrivateRoute>
  );
};

export default AdminLayout;
