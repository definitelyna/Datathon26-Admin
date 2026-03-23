import { useEffect, useState } from "react";
import { Outlet, Link, useLocation } from "react-router";
import { Users, FileText, CheckCircle, LogOut, Menu, X } from "lucide-react";
import { useDatathon } from "../contexts/DatathonContext";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { firstRoundSubmissions, secondRoundSubmissions } = useDatathon();
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Calculate filtered second round submissions
  const passedTeamIds = firstRoundSubmissions
    .filter((sub) => sub.result === "pass")
    .map((sub) => sub.teamId);

  const filteredSecondRoundSubmissions = secondRoundSubmissions.filter((sub) =>
    passedTeamIds.includes(sub.teamId),
  );

  const navItems = [
    { path: "/", label: "Teams", icon: Users, count: null },
    {
      path: "/first-round",
      label: "First Round",
      icon: FileText,
      count: firstRoundSubmissions.length,
    },
    {
      path: "/second-round",
      label: "Second Round",
      icon: CheckCircle,
      count: filteredSecondRoundSubmissions.length,
    },
  ];

  const handleLogout = () => {
    setIsSidebarOpen(false);
    logout();
    navigate("/login");
  };

  return (
    <div className="relative flex h-screen bg-zinc-950 text-zinc-100">
      <div
        className={`fixed inset-0 z-30 bg-black/60 transition-opacity md:hidden ${
          isSidebarOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-zinc-800 bg-zinc-900 transition-transform duration-200 md:static md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-zinc-800">
          <h1 className="text-2xl font-semibold">Datathon Admin</h1>
          <p className="text-sm text-zinc-400 mt-1">Competition Management</p>
        </div>

        <nav className="flex-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                  isActive
                    ? "bg-zinc-800 text-zinc-100"
                    : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100"
                }`}
              >
                <Icon className="size-5" />
                <span className="flex-1">{item.label}</span>
                {item.count !== null && (
                  <span
                    className={`text-sm font-mono px-2 py-0.5 rounded ${
                      isActive
                        ? "bg-zinc-700 text-zinc-100"
                        : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-zinc-800">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
          >
            <LogOut className="size-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-4 py-3 md:hidden">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="h-9 w-9 p-0 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
            aria-label={isSidebarOpen ? "Close navigation" : "Open navigation"}
          >
            {isSidebarOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
          <p className="text-sm font-medium text-zinc-300">Datathon Admin</p>
          <div className="h-9 w-9" />
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
