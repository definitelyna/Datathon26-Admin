import { createContext, useContext, useState, ReactNode } from "react";

export interface Team {
  id: string;
  name: string;
  leader: string;
  email: string;
  members: number;
  institution: string;
  registeredDate: string;
  status: "registered" | "proceeded-to-second-round" | "failed-first-round" | "failed-second-round" | "passed-competition";
}

export interface FirstRoundSubmission {
  id: string;
  teamId: string;
  teamName: string;
  fileName: string;
  fileSize: string;
  submittedDate: string;
  submittedTime: string;
  result: "pending-review" | "pass" | "fail";
}

export interface SecondRoundSubmission {
  id: string;
  teamId: string;
  teamName: string;
  fileName: string;
  fileSize: string;
  submittedDate: string;
  submittedTime: string;
  score: number | null;
  result: "pending-review" | "pass" | "fail";
}

interface DatathonContextType {
  teams: Team[];
  firstRoundSubmissions: FirstRoundSubmission[];
  secondRoundSubmissions: SecondRoundSubmission[];
  updateFirstRoundResult: (
    submissionId: string,
    newResult: FirstRoundSubmission["result"]
  ) => void;
  updateSecondRoundResult: (
    submissionId: string,
    newResult: SecondRoundSubmission["result"]
  ) => void;
  updateSecondRoundScore: (
    submissionId: string,
    newScore: number | null
  ) => void;
}

const DatathonContext = createContext<DatathonContextType | undefined>(undefined);

const initialTeams: Team[] = [
  {
    id: "T001",
    name: "Data Wizards",
    leader: "Alice Johnson",
    email: "alice@datawizards.com",
    members: 4,
    institution: "MIT",
    registeredDate: "2026-01-15",
    status: "registered",
  },
  {
    id: "T002",
    name: "Analytics Masters",
    leader: "Bob Smith",
    email: "bob@analyticsm.com",
    members: 3,
    institution: "Stanford University",
    registeredDate: "2026-01-18",
    status: "registered",
  },
  {
    id: "T003",
    name: "ML Champions",
    leader: "Carol Davis",
    email: "carol@mlchamps.com",
    members: 5,
    institution: "UC Berkeley",
    registeredDate: "2026-01-20",
    status: "registered",
  },
  {
    id: "T004",
    name: "Code Breakers",
    leader: "David Lee",
    email: "david@codebreak.com",
    members: 4,
    institution: "Harvard University",
    registeredDate: "2026-01-22",
    status: "registered",
  },
  {
    id: "T005",
    name: "Neural Networks",
    leader: "Eva Martinez",
    email: "eva@neuralnet.com",
    members: 3,
    institution: "Carnegie Mellon",
    registeredDate: "2026-01-25",
    status: "registered",
  },
  {
    id: "T006",
    name: "Big Data Brains",
    leader: "Frank Wilson",
    email: "frank@bigdatab.com",
    members: 4,
    institution: "Georgia Tech",
    registeredDate: "2026-01-28",
    status: "registered",
  },
  {
    id: "T007",
    name: "Python Pioneers",
    leader: "Grace Chen",
    email: "grace@pythonp.com",
    members: 5,
    institution: "Caltech",
    registeredDate: "2026-02-01",
    status: "registered",
  },
  {
    id: "T008",
    name: "Stat Squad",
    leader: "Henry Taylor",
    email: "henry@statsquad.com",
    members: 3,
    institution: "Oxford University",
    registeredDate: "2026-02-03",
    status: "registered",
  },
  {
    id: "T009",
    name: "Algorithm Aces",
    leader: "Iris Brown",
    email: "iris@algoaces.com",
    members: 4,
    institution: "Princeton University",
    registeredDate: "2026-02-05",
    status: "registered",
  },
  {
    id: "T010",
    name: "Data Dynamos",
    leader: "Jack Robinson",
    email: "jack@datadynamo.com",
    members: 5,
    institution: "Cornell University",
    registeredDate: "2026-02-08",
    status: "registered",
  },
];

const initialFirstRoundSubmissions: FirstRoundSubmission[] = [
  {
    id: "S1001",
    teamId: "T001",
    teamName: "Data Wizards",
    fileName: "datawizards_round1_analysis.pdf",
    fileSize: "2.4 MB",
    submittedDate: "2026-02-10",
    submittedTime: "14:23:45",
    result: "pending-review",
  },
  {
    id: "S1002",
    teamId: "T002",
    teamName: "Analytics Masters",
    fileName: "analytics_masters_submission_r1.zip",
    fileSize: "5.8 MB",
    submittedDate: "2026-02-10",
    submittedTime: "16:45:12",
    result: "pending-review",
  },
  {
    id: "S1003",
    teamId: "T003",
    teamName: "ML Champions",
    fileName: "mlchampions_firstround.pdf",
    fileSize: "3.2 MB",
    submittedDate: "2026-02-11",
    submittedTime: "09:12:33",
    result: "pending-review",
  },
  {
    id: "S1004",
    teamId: "T004",
    teamName: "Code Breakers",
    fileName: "codebreakers_round1.pdf",
    fileSize: "3.8 MB",
    submittedDate: "2026-02-10",
    submittedTime: "11:34:56",
    result: "pending-review",
  },
  {
    id: "S1005",
    teamId: "T005",
    teamName: "Neural Networks",
    fileName: "neural_networks_r1_final.pdf",
    fileSize: "4.1 MB",
    submittedDate: "2026-02-10",
    submittedTime: "13:56:22",
    result: "pending-review",
  },
  {
    id: "S1006",
    teamId: "T006",
    teamName: "Big Data Brains",
    fileName: "bigdata_analysis_round1.zip",
    fileSize: "7.3 MB",
    submittedDate: "2026-02-10",
    submittedTime: "17:34:11",
    result: "pending-review",
  },
  {
    id: "S1007",
    teamId: "T007",
    teamName: "Python Pioneers",
    fileName: "python_pioneers_submission.pdf",
    fileSize: "2.9 MB",
    submittedDate: "2026-02-10",
    submittedTime: "15:41:09",
    result: "pending-review",
  },
  {
    id: "S1008",
    teamId: "T008",
    teamName: "Stat Squad",
    fileName: "stat_squad_round1_report.pdf",
    fileSize: "3.5 MB",
    submittedDate: "2026-02-11",
    submittedTime: "10:18:44",
    result: "pending-review",
  },
  {
    id: "S1009",
    teamId: "T009",
    teamName: "Algorithm Aces",
    fileName: "algo_aces_round1_report.pdf",
    fileSize: "3.6 MB",
    submittedDate: "2026-02-10",
    submittedTime: "11:23:55",
    result: "pending-review",
  },
  {
    id: "S1010",
    teamId: "T010",
    teamName: "Data Dynamos",
    fileName: "datadynamos_round1.zip",
    fileSize: "6.2 MB",
    submittedDate: "2026-02-11",
    submittedTime: "08:47:33",
    result: "pending-review",
  },
];

const initialSecondRoundSubmissions: SecondRoundSubmission[] = [
  {
    id: "S2001",
    teamId: "T001",
    teamName: "Data Wizards",
    fileName: "datawizards_round2_final.pdf",
    fileSize: "4.7 MB",
    submittedDate: "2026-02-20",
    submittedTime: "15:33:21",
    score: 92,
    result: "pending-review",
  },
  {
    id: "S2002",
    teamId: "T002",
    teamName: "Analytics Masters",
    fileName: "analytics_masters_final_presentation.zip",
    fileSize: "8.2 MB",
    submittedDate: "2026-02-20",
    submittedTime: "16:12:44",
    score: 88,
    result: "pending-review",
  },
  {
    id: "S2003",
    teamId: "T003",
    teamName: "ML Champions",
    fileName: "mlchampions_round2_final.pdf",
    fileSize: "5.3 MB",
    submittedDate: "2026-02-20",
    submittedTime: "14:18:29",
    score: 90,
    result: "pending-review",
  },
  {
    id: "S2004",
    teamId: "T004",
    teamName: "Code Breakers",
    fileName: "codebreakers_final_solution.pdf",
    fileSize: "5.6 MB",
    submittedDate: "2026-02-20",
    submittedTime: "13:28:15",
    score: 85,
    result: "pending-review",
  },
  {
    id: "S2005",
    teamId: "T005",
    teamName: "Neural Networks",
    fileName: "neural_networks_final_solution.pdf",
    fileSize: "5.1 MB",
    submittedDate: "2026-02-20",
    submittedTime: "14:45:09",
    score: 78,
    result: "pending-review",
  },
  {
    id: "S2006",
    teamId: "T006",
    teamName: "Big Data Brains",
    fileName: "bigdata_round2_submission.pdf",
    fileSize: "6.4 MB",
    submittedDate: "2026-02-20",
    submittedTime: "16:22:51",
    score: 83,
    result: "pending-review",
  },
  {
    id: "S2007",
    teamId: "T007",
    teamName: "Python Pioneers",
    fileName: "python_pioneers_round2.pdf",
    fileSize: "4.3 MB",
    submittedDate: "2026-02-20",
    submittedTime: "11:52:38",
    score: 91,
    result: "pending-review",
  },
  {
    id: "S2008",
    teamId: "T008",
    teamName: "Stat Squad",
    fileName: "stat_squad_final_analysis.pdf",
    fileSize: "4.5 MB",
    submittedDate: "2026-02-20",
    submittedTime: "09:36:42",
    score: 86,
    result: "pending-review",
  },
  {
    id: "S2009",
    teamId: "T009",
    teamName: "Algorithm Aces",
    fileName: "algo_aces_final_submission.pdf",
    fileSize: "4.9 MB",
    submittedDate: "2026-02-20",
    submittedTime: "12:54:17",
    score: 94,
    result: "pending-review",
  },
  {
    id: "S2010",
    teamId: "T010",
    teamName: "Data Dynamos",
    fileName: "datadynamos_final_project.zip",
    fileSize: "7.8 MB",
    submittedDate: "2026-02-20",
    submittedTime: "10:23:51",
    score: 89,
    result: "pending-review",
  },
];

export function DatathonProvider({ children }: { children: ReactNode }) {
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [firstRoundSubmissions, setFirstRoundSubmissions] = useState<FirstRoundSubmission[]>(
    initialFirstRoundSubmissions
  );
  const [secondRoundSubmissions, setSecondRoundSubmissions] = useState<SecondRoundSubmission[]>(
    initialSecondRoundSubmissions
  );

  const updateTeamStatus = (
    teamId: string,
    firstRoundResult?: FirstRoundSubmission["result"],
    secondRoundResult?: SecondRoundSubmission["result"]
  ) => {
    setTeams((prevTeams) =>
      prevTeams.map((team) => {
        if (team.id !== teamId) return team;

        // Determine new status based on results
        if (secondRoundResult === "pass") {
          return { ...team, status: "passed-competition" as const };
        } else if (secondRoundResult === "fail") {
          return { ...team, status: "failed-second-round" as const };
        } else if (firstRoundResult === "pass") {
          return { ...team, status: "proceeded-to-second-round" as const };
        } else if (firstRoundResult === "fail") {
          return { ...team, status: "failed-first-round" as const };
        }

        return { ...team, status: "registered" as const };
      })
    );
  };

  const updateFirstRoundResult = (
    submissionId: string,
    newResult: FirstRoundSubmission["result"]
  ) => {
    setFirstRoundSubmissions((prev) => {
      const updated = prev.map((sub) =>
        sub.id === submissionId ? { ...sub, result: newResult } : sub
      );

      // Update team status
      const submission = updated.find((s) => s.id === submissionId);
      if (submission) {
        const secondRoundSub = secondRoundSubmissions.find(
          (s) => s.teamId === submission.teamId
        );
        updateTeamStatus(
          submission.teamId,
          newResult,
          secondRoundSub?.result
        );
      }

      return updated;
    });
  };

  const updateSecondRoundResult = (
    submissionId: string,
    newResult: SecondRoundSubmission["result"]
  ) => {
    setSecondRoundSubmissions((prev) => {
      const updated = prev.map((sub) =>
        sub.id === submissionId ? { ...sub, result: newResult } : sub
      );

      // Update team status
      const submission = updated.find((s) => s.id === submissionId);
      if (submission) {
        const firstRoundSub = firstRoundSubmissions.find(
          (s) => s.teamId === submission.teamId
        );
        updateTeamStatus(
          submission.teamId,
          firstRoundSub?.result,
          newResult
        );
      }

      return updated;
    });
  };

  const updateSecondRoundScore = (
    submissionId: string,
    newScore: number | null
  ) => {
    setSecondRoundSubmissions((prev) => {
      const updated = prev.map((sub) =>
        sub.id === submissionId ? { ...sub, score: newScore } : sub
      );

      return updated;
    });
  };

  return (
    <DatathonContext.Provider
      value={{
        teams,
        firstRoundSubmissions,
        secondRoundSubmissions,
        updateFirstRoundResult,
        updateSecondRoundResult,
        updateSecondRoundScore,
      }}
    >
      {children}
    </DatathonContext.Provider>
  );
}

export function useDatathon() {
  const context = useContext(DatathonContext);
  if (context === undefined) {
    throw new Error("useDatathon must be used within a DatathonProvider");
  }
  return context;
}