import { useState, useMemo } from "react";
import { Search, Mail, Calendar } from "lucide-react";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useDatathon } from "../contexts/DatathonContext";

export function Teams() {
  const { teams } = useDatathon();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTeams = useMemo(() => {
    if (!searchQuery.trim()) return teams;

    const query = searchQuery.toLowerCase();
    return teams.filter(
      (team) =>
        team.teamName.toLowerCase().includes(query) ||
        team.members.some((member) =>
          member.memberName.toLowerCase().includes(query),
        ) ||
        team.contactEmail.toLowerCase().includes(query) ||
        team.institution.toLowerCase().includes(query) ||
        team.id.toLowerCase().includes(query),
    );
  }, [searchQuery, teams]);

  const getStatusDisplay = (status: (typeof teams)[0]["status"]) => {
    switch (status) {
      case "registered":
        return { text: "Registered", color: "text-zinc-400" };
      case "proceeded-to-second-round":
        return { text: "Proceeded to Second Round", color: "text-blue-400" };
      case "failed-first-round":
        return { text: "Failed First Round", color: "text-red-400" };
      case "failed-second-round":
        return { text: "Failed Second Round", color: "text-red-400" };
      case "passed-competition":
        return { text: "Passed Competition", color: "text-emerald-400" };
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold mb-2">Registered Teams</h2>
        <p className="text-zinc-400">
          View and search all teams registered for the Datathon
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-zinc-400" />
        <Input
          type="text"
          placeholder="Search by team name, leader, email, institution, or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-700"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="text-2xl font-semibold">{teams.length}</div>
          <div className="text-sm text-zinc-400">Total Teams</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="text-2xl font-semibold text-blue-400">
            {
              teams.filter((t) => t.status === "proceeded-to-second-round")
                .length
            }
          </div>
          <div className="text-sm text-zinc-400">In Second Round</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="text-2xl font-semibold text-emerald-400">
            {teams.filter((t) => t.status === "passed-competition").length}
          </div>
          <div className="text-sm text-zinc-400">Passed</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="text-2xl font-semibold text-red-400">
            {
              teams.filter(
                (t) =>
                  t.status === "failed-first-round" ||
                  t.status === "failed-second-round",
              ).length
            }
          </div>
          <div className="text-sm text-zinc-400">Failed</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-zinc-800/50 align-middle">
              <TableHead className="text-zinc-300">Team ID</TableHead>
              <TableHead className="text-zinc-300">Team Name</TableHead>
              <TableHead className="text-zinc-300">Team Leader</TableHead>
              <TableHead className="text-zinc-300">Email</TableHead>
              <TableHead className="text-zinc-300">Institution</TableHead>
              <TableHead className="text-zinc-300">Members</TableHead>
              <TableHead className="text-zinc-300">Registered</TableHead>
              <TableHead className="text-zinc-300">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTeams.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center text-zinc-400 py-8"
                >
                  No teams found matching your search
                </TableCell>
              </TableRow>
            ) : (
              filteredTeams.map((team) => {
                const statusDisplay = getStatusDisplay(team.status);
                console.log(statusDisplay);
                const leaderName = team.members?.filter(
                  (m: any) => m.role === "team_leader",
                )?.[0]?.memberName;
                return (
                  <TableRow
                    key={team.id}
                    className="border-zinc-800 hover:bg-zinc-800/30 align-middle"
                  >
                    <TableCell className="font-mono text-zinc-300">
                      {team.id}
                    </TableCell>
                    <TableCell className="font-medium text-zinc-100">
                      {team.teamName}
                    </TableCell>
                    <TableCell className="text-zinc-300">
                      {leaderName}
                    </TableCell>

                    <TableCell className="text-zinc-400 align-middle">
                      <div className="flex items-center gap-2">
                        <Mail className="size-4" />
                        {team.contactEmail}
                      </div>
                    </TableCell>

                    <TableCell className="text-zinc-300">
                      {team.institution}
                    </TableCell>

                    <TableCell className="text-zinc-300">
                      {team.members && team.members.length > 0
                        ? team.members.map((m) => (
                            <p key={m.memberName}>{m.memberName}</p>
                          ))
                        : "—"}
                    </TableCell>

                    {/* FIXED: Moved flex classes to an inner div */}
                    <TableCell className="text-zinc-400 align-middle">
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4" />
                        {team.registeredAt.toLocaleDateString()}
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className={`font-medium ${statusDisplay.color}`}>
                        {statusDisplay.text}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 text-sm text-zinc-400">
        Showing {filteredTeams.length} of {teams.length} teams
      </div>
    </div>
  );
}
