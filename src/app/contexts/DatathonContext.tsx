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
    major?: string;
    dob?: string;
    university?: string;
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
  githubLink: string;
  presentationLink: string;
  submittedDate: Date;
  submittedTime: string;
  result: "pending-review" | "pass" | "fail";
}

export interface SecondRoundSubmission {
  id: string;
  teamId: string;
  teamName: string;
  fileLink: string;
  submittedDate: Date;
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
    githubLink: "https://www.youtube.com/",
    presentationLink: "https://www.youtube.com/",
    submittedDate: new Date("2026-02-10"),
    submittedTime: "14:23:45",
    result: "pending-review",
  },
  {
    id: "S1002",
    teamId: "T002",
    teamName: "Analytics Masters",
    githubLink: "https://www.youtube.com/",
    presentationLink: "https://www.youtube.com/",
    submittedDate: new Date("2026-02-10"),
    submittedTime: "16:45:12",
    result: "pending-review",
  },
  {
    id: "S1003",
    teamId: "T003",
    teamName: "ML Champions",
    githubLink: "https://www.youtube.com/",
    presentationLink: "https://www.youtube.com/",
    submittedDate: new Date("2026-02-11"),
    submittedTime: "09:12:33",
    result: "pending-review",
  },
  {
    id: "S1004",
    teamId: "T004",
    teamName: "Code Breakers",
    githubLink: "https://www.youtube.com/",
    presentationLink: "https://www.youtube.com/",
    submittedDate: new Date("2026-02-10"),
    submittedTime: "11:34:56",
    result: "pending-review",
  },
  {
    id: "S1005",
    teamId: "T005",
    teamName: "Neural Networks",
    githubLink: "https://www.youtube.com/",
    presentationLink: "https://www.youtube.com/",
    submittedDate: new Date("2026-02-10"),
    submittedTime: "13:56:22",
    result: "pending-review",
  },
  {
    id: "S1006",
    teamId: "T006",
    teamName: "Big Data Brains",
    githubLink: "https://www.youtube.com/",
    presentationLink: "https://www.youtube.com/",
    submittedDate: new Date("2026-02-10"),
    submittedTime: "17:34:11",
    result: "pending-review",
  },
  {
    id: "S1007",
    teamId: "T007",
    teamName: "Python Pioneers",
    githubLink: "https://www.youtube.com/",
    presentationLink: "https://www.youtube.com/",
    submittedDate: new Date("2026-02-10"),
    submittedTime: "15:41:09",
    result: "pending-review",
  },
  {
    id: "S1008",
    teamId: "T008",
    teamName: "Stat Squad",
    githubLink: "https://www.youtube.com/",
    presentationLink: "https://www.youtube.com/",
    submittedDate: new Date("2026-02-11"),
    submittedTime: "10:18:44",
    result: "pending-review",
  },
  {
    id: "S1009",
    teamId: "T009",
    teamName: "Algorithm Aces",
    githubLink: "https://www.youtube.com/",
    presentationLink: "https://www.youtube.com/",
    submittedDate: new Date("2026-02-10"),
    submittedTime: "11:23:55",
    result: "pending-review",
  },
  {
    id: "S1010",
    teamId: "T010",
    teamName: "Data Dynamos",
    githubLink: "https://www.youtube.com/",
    presentationLink: "https://www.youtube.com/",
    submittedDate: new Date("2026-02-11"),
    submittedTime: "08:47:33",
    result: "pending-review",
  },
];

const initialSecondRoundSubmissions: SecondRoundSubmission[] = [
  {
    id: "S2001",
    teamId: "T001",
    teamName: "Data Wizards",
    fileLink: "https://www.youtube.com/",
    submittedDate: new Date("2026-02-20"),
    score: 92,
    result: "pending-review",
  },
  {
    id: "S2002",
    teamId: "T002",
    teamName: "Analytics Masters",
    fileLink: "https://www.youtube.com/",
    submittedDate: new Date("2026-02-20"),
    score: 88,
    result: "pending-review",
  },
  {
    id: "S2003",
    teamId: "T003",
    teamName: "ML Champions",
    fileLink: "https://www.youtube.com/",
    submittedDate: new Date("2026-02-20"),
    score: 90,
    result: "pending-review",
  },
  {
    id: "S2004",
    teamId: "T004",
    teamName: "Code Breakers",
    fileLink: "https://www.youtube.com/",
    submittedDate: new Date("2026-02-20"),
    score: 85,
    result: "pending-review",
  },
  {
    id: "S2005",
    teamId: "T005",
    teamName: "Neural Networks",
    fileLink: "https://www.youtube.com/",
    submittedDate: new Date("2026-02-20"),
    score: 78,
    result: "pending-review",
  },
  {
    id: "S2006",
    teamId: "T006",
    teamName: "Big Data Brains",
    fileLink: "https://www.youtube.com/",
    submittedDate: new Date("2026-02-20"),
    score: 83,
    result: "pending-review",
  },
  {
    id: "S2007",
    teamId: "T007",
    teamName: "Python Pioneers",
    fileLink: "https://www.youtube.com/",
    submittedDate: new Date("2026-02-20"),
    score: 91,
    result: "pending-review",
  },
  {
    id: "S2008",
    teamId: "T008",
    teamName: "Stat Squad",
    fileLink: "https://www.youtube.com/",
    submittedDate: new Date("2026-02-20"),
    score: 86,
    result: "pending-review",
  },
  {
    id: "S2009",
    teamId: "T009",
    teamName: "Algorithm Aces",
    fileLink: "https://www.youtube.com/",
    submittedDate: new Date("2026-02-20"),
    score: 94,
    result: "pending-review",
  },
  {
    id: "S2010",
    teamId: "T010",
    teamName: "Data Dynamos",
    fileLink: "https://www.youtube.com/",
    submittedDate: new Date("2026-02-20"),
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
          submittedDate: doc.data().submittedDate?.toDate(),
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
