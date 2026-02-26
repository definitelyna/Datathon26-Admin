import { useState } from "react";
import { Award, Mail } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useDatathon, SecondRoundSubmission } from "../contexts/DatathonContext";

export function SecondRoundSubmissions() {
  const {
    secondRoundSubmissions,
    firstRoundSubmissions,
    updateSecondRoundResult,
    updateSecondRoundScore,
  } = useDatathon();
  const [mailDialogOpen, setMailDialogOpen] = useState(false);
  const [mailDialogType, setMailDialogType] = useState<"question" | "result">(
    "question"
  );
  const [confirmationText, setConfirmationText] = useState("");

  // Filter to show only teams that passed first round
  const passedTeamIds = firstRoundSubmissions
    .filter((sub) => sub.result === "pass")
    .map((sub) => sub.teamId);

  const filteredSecondRoundSubmissions = secondRoundSubmissions.filter((sub) =>
    passedTeamIds.includes(sub.teamId)
  );

  const requiredText =
    mailDialogType === "question"
      ? "Mail Question Round 2"
      : "Mail Result Round 2";

  const handleResultChange = (submissionId: string, newResult: SecondRoundSubmission["result"]) => {
    updateSecondRoundResult(submissionId, newResult);
  };

  const handleScoreChange = (submissionId: string, value: string) => {
    const numValue = value === "" ? null : parseInt(value, 10);
    if (numValue === null || (!isNaN(numValue) && numValue >= 0 && numValue <= 100)) {
      updateSecondRoundScore(submissionId, numValue);
    }
  };

  const openMailDialog = (type: "question" | "result") => {
    setMailDialogType(type);
    setConfirmationText("");
    setMailDialogOpen(true);
  };

  const handleMailConfirm = () => {
    // Handle mail sending logic here
    console.log(`Sending ${mailDialogType} email for Round 2`);
    setMailDialogOpen(false);
    setConfirmationText("");
  };

  const getResultBadge = (result: SecondRoundSubmission["result"]) => {
    switch (result) {
      case "pass":
        return (
          <Badge className="bg-emerald-900/50 text-emerald-300 border-emerald-800">
            Pass
          </Badge>
        );
      case "fail":
        return (
          <Badge className="bg-red-900/50 text-red-300 border-red-800">
            Fail
          </Badge>
        );
      case "pending-review":
        return (
          <Badge className="bg-amber-900/50 text-amber-300 border-amber-800">
            Pending Review
          </Badge>
        );
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-400";
    if (score >= 80) return "text-blue-400";
    if (score >= 70) return "text-amber-400";
    return "text-red-400";
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-semibold mb-2">
            Second Round Submissions
          </h2>
          <p className="text-zinc-400">
            Review final submissions and scores from qualified teams
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => openMailDialog("question")}
            className="bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700"
          >
            <Mail className="size-4 mr-2" />
            Mail Question
          </Button>
          <Button 
            onClick={() => openMailDialog("result")}
            className="bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700"
          >
            <Mail className="size-4 mr-2" />
            Mail Result
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="text-2xl font-semibold">{filteredSecondRoundSubmissions.length}</div>
          <div className="text-sm text-zinc-400">Total Submissions</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="text-2xl font-semibold text-emerald-400">
            {filteredSecondRoundSubmissions.filter((s) => s.result === "pass").length}
          </div>
          <div className="text-sm text-zinc-400">Pass</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="text-2xl font-semibold text-red-400">
            {filteredSecondRoundSubmissions.filter((s) => s.result === "fail").length}
          </div>
          <div className="text-sm text-zinc-400">Fail</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="text-2xl font-semibold text-blue-400">
            {(
              filteredSecondRoundSubmissions.filter((s) => s.score !== null).reduce(
                (acc, s) => acc + (s.score || 0),
                0
              ) / filteredSecondRoundSubmissions.filter((s) => s.score !== null).length || 0
            ).toFixed(1)}
          </div>
          <div className="text-sm text-zinc-400">Average Score</div>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
              <TableHead className="text-zinc-300">Team</TableHead>
              <TableHead className="text-zinc-300">Score</TableHead>
              <TableHead className="text-zinc-300">Result</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSecondRoundSubmissions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-zinc-400 py-8"
                >
                  No submissions from teams that passed the first round
                </TableCell>
              </TableRow>
            ) : (
              filteredSecondRoundSubmissions.map((submission) => (
                <TableRow
                  key={submission.id}
                  className="border-zinc-800 hover:bg-zinc-800/30"
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {submission.result === "pass" && (
                        <Award className="size-4 text-emerald-400" />
                      )}
                      <div>
                        <div className="font-medium text-zinc-100">
                          {submission.teamName}
                        </div>
                        <div className="text-sm text-zinc-400 font-mono">
                          {submission.teamId}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {submission.score !== null ? (
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={submission.score}
                        onChange={(e) =>
                          handleScoreChange(submission.id, e.target.value)
                        }
                        className={`w-20 text-lg font-semibold bg-zinc-800 border-zinc-700 ${getScoreColor(
                          submission.score
                        )}`}
                      />
                    ) : (
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="--"
                        value=""
                        onChange={(e) =>
                          handleScoreChange(submission.id, e.target.value)
                        }
                        className="w-20 bg-zinc-800 border-zinc-700 text-zinc-500 placeholder:text-zinc-600"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={submission.result}
                      onValueChange={(value) =>
                        handleResultChange(submission.id, value as SecondRoundSubmission["result"])
                      }
                    >
                      <SelectTrigger className="w-[140px] bg-zinc-800 border-zinc-700 text-zinc-100">
                        <SelectValue>
                          {getResultBadge(submission.result)}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700">
                        <SelectItem value="pending-review" className="text-zinc-100">
                          <Badge className="bg-amber-900/50 text-amber-300 border-amber-800">
                            Pending Review
                          </Badge>
                        </SelectItem>
                        <SelectItem value="pass" className="text-zinc-100">
                          <Badge className="bg-emerald-900/50 text-emerald-300 border-emerald-800">
                            Pass
                          </Badge>
                        </SelectItem>
                        <SelectItem value="fail" className="text-zinc-100">
                          <Badge className="bg-red-900/50 text-red-300 border-red-800">
                            Fail
                          </Badge>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 text-sm text-zinc-400">
        Showing {filteredSecondRoundSubmissions.length} submissions
      </div>

      {/* Mail Confirmation Dialog */}
      <Dialog open={mailDialogOpen} onOpenChange={setMailDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
          <DialogHeader>
            <DialogTitle>
              Confirm {mailDialogType === "question" ? "Question" : "Result"} Email
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              This will send an email to all teams in Second Round. To confirm, please type:{" "}
              <span className="font-semibold text-zinc-200">{requiredText}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="confirmation" className="text-zinc-300">
              Confirmation Text
            </Label>
            <Input
              id="confirmation"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder={requiredText}
              className="mt-2 bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setMailDialogOpen(false)}
              className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleMailConfirm}
              disabled={confirmationText !== requiredText}
              className="bg-emerald-700 text-white hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Mail className="size-4 mr-2" />
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}