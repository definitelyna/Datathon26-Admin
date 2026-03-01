import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { db } from "../../../firebase/firebase";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";

export interface Team {
  id: string;
  teamName: string;
  contactEmail: string;
  members: {
    memberName: string;
    role: "team_leader" | "team_member";
    phone: string;
    email: string;
  }[];
  institution: string;
  registeredAt: Date;
  status:
    | "registered"
    | "proceeded-to-second-round"
    | "failed-first-round"
    | "failed-second-round"
    | "passed-competition";
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
    newResult: FirstRoundSubmission["result"],
  ) => void;
  updateSecondRoundResult: (
    submissionId: string,
    newResult: SecondRoundSubmission["result"],
  ) => void;
  updateSecondRoundScore: (
    submissionId: string,
    newScore: number | null,
  ) => void;
}

const DatathonContext = createContext<DatathonContextType | undefined>(
  undefined,
);

const initialTeams: Team[] = [
  {
    id: "T001",
    teamName: "Data Wizards",
    contactEmail: "alice@datawizards.com",
    members: [
      {
        memberName: "Alice Johnson",
        role: "team_leader",
        phone: "123-456-7890",
        email: "alice@datawizards.com",
      },
      {
        memberName: "Bob Smith",
        role: "team_member",
        phone: "234-567-8901",
        email: "bob@datawizards.com",
      },
      {
        memberName: "Charlie Brown",
        role: "team_member",
        phone: "345-678-9012",
        email: "charlie@datawizards.com",
      },
      {
        memberName: "Diana Prince",
        role: "team_member",
        phone: "456-789-0123",
        email: "diana@datawizards.com",
      },
    ],
    institution: "MIT",
    registeredAt: new Date("2026-01-15"),
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
  const [firstRoundSubmissions, setFirstRoundSubmissions] = useState<
    FirstRoundSubmission[]
  >(initialFirstRoundSubmissions);
  const [secondRoundSubmissions, setSecondRoundSubmissions] = useState<
    SecondRoundSubmission[]
  >(initialSecondRoundSubmissions);

  useEffect(() => {
    const teamsRef = collection(db, "teams");
    const teamUnsubscribe = onSnapshot(teamsRef, (snapshot) => {
      const teamsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        // Ensure `registeredAt` is a JS `Date` to match the `Team` type
        registeredAt: doc.data().registeredAt?.toDate(),
      })) as Team[];

      // Prevent overwriting initial mock data if the database is completely empty
      if (teamsData.length > 0) setTeams(teamsData);
    });

    return () => teamUnsubscribe();
  }, []);

  useEffect(() => {
    const firstRoundSubmissionsRef = collection(db, "firstRoundSubmissions");
    const firstRoundUnsubscribe = onSnapshot(
      firstRoundSubmissionsRef,
      (snapshot) => {
        const firstRoundData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          submittedDate: doc.data().submittedDate?.toDate().toISOString() || "",
        })) as FirstRoundSubmission[];

        if (firstRoundData.length > 0) setFirstRoundSubmissions(firstRoundData);
      },
    );
    return () => firstRoundUnsubscribe();
  }, []);

  useEffect(() => {
    const secondRoundSubmissionsRef = collection(db, "secondRoundSubmissions");
    const secondRoundUnsubscribe = onSnapshot(
      secondRoundSubmissionsRef,
      (snapshot) => {
        const secondRoundData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as SecondRoundSubmission[];

        if (secondRoundData.length > 0)
          setSecondRoundSubmissions(secondRoundData);
      },
    );
    return () => secondRoundUnsubscribe();
  }, []);

  // Update Firestore instead of local state
  const updateTeamStatus = async (
    teamId: string,
    firstRoundResult?: FirstRoundSubmission["result"],
    secondRoundResult?: SecondRoundSubmission["result"],
  ) => {
    let newStatus = "registered";

    if (secondRoundResult === "pass") {
      newStatus = "passed-competition";
    } else if (secondRoundResult === "fail") {
      newStatus = "failed-second-round";
    } else if (firstRoundResult === "pass") {
      newStatus = "proceeded-to-second-round";
    } else if (firstRoundResult === "fail") {
      newStatus = "failed-first-round";
    }

    const teamRef = doc(db, "teams", teamId);
    try {
      await updateDoc(teamRef, { status: newStatus });
    } catch (error) {
      console.error("Error updating team status in Firestore:", error);
    }
  };

  const updateFirstRoundResult = async (
    submissionId: string,
    newResult: FirstRoundSubmission["result"],
  ) => {
    try {
      // 1. Update the submission document in Firestore
      const submissionRef = doc(db, "firstRoundSubmissions", submissionId);
      await updateDoc(submissionRef, { result: newResult });

      // 2. Determine and update the team status in Firestore
      const submission = firstRoundSubmissions.find(
        (s) => s.id === submissionId,
      );
      if (submission) {
        const secondRoundSub = secondRoundSubmissions.find(
          (s) => s.teamId === submission.teamId,
        );
        await updateTeamStatus(
          submission.teamId,
          newResult,
          secondRoundSub?.result,
        );
      }
    } catch (error) {
      console.error("Error updating first round result:", error);
    }
  };

  const updateSecondRoundResult = async (
    submissionId: string,
    newResult: SecondRoundSubmission["result"],
  ) => {
    try {
      // 1. Update the submission document in Firestore
      const submissionRef = doc(db, "secondRoundSubmissions", submissionId);
      await updateDoc(submissionRef, { result: newResult });

      // 2. Determine and update the team status in Firestore
      const submission = secondRoundSubmissions.find(
        (s) => s.id === submissionId,
      );
      if (submission) {
        const firstRoundSub = firstRoundSubmissions.find(
          (s) => s.teamId === submission.teamId,
        );
        await updateTeamStatus(
          submission.teamId,
          firstRoundSub?.result,
          newResult,
        );
      }
    } catch (error) {
      console.error("Error updating second round result:", error);
    }
  };

  const updateSecondRoundScore = async (
    submissionId: string,
    newScore: number | null,
  ) => {
    try {
      const submissionRef = doc(db, "secondRoundSubmissions", submissionId);
      await updateDoc(submissionRef, { score: newScore });
    } catch (error) {
      console.error("Error updating second round score:", error);
    }
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
