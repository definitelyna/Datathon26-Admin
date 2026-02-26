import { Outlet, Link, useLocation } from "react-router";
import { Users, FileText, CheckCircle, LogOut } from "lucide-react";
import { useDatathon } from "../contexts/DatathonContext";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { firstRoundSubmissions, secondRoundSubmissions } = useDatathon();
  const { logout } = useAuth();

  // Calculate filtered second round submissions
  const passedTeamIds = firstRoundSubmissions
    .filter((sub) => sub.result === "pass")
    .map((sub) => sub.teamId);

  const filteredSecondRoundSubmissions = secondRoundSubmissions.filter((sub) =>
    passedTeamIds.includes(sub.teamId)
  );

  const navItems = [
    { path: "/", label: "Teams", icon: Users, count: null },
    { path: "/first-round", label: "First Round", icon: FileText, count: firstRoundSubmissions.length },
    { path: "/second-round", label: "Second Round", icon: CheckCircle, count: filteredSecondRoundSubmissions.length },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
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
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                  isActive
                    ? "bg-zinc-800 text-zinc-100"
                    : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100"
                }`}
              >
                <Icon className="size-5" />
                <span className="flex-1">{item.label}</span>
                {item.count !== null && (
                  <span className={`text-sm font-mono px-2 py-0.5 rounded ${
                    isActive ? "bg-zinc-700 text-zinc-100" : "bg-zinc-800 text-zinc-400"
                  }`}>
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

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}