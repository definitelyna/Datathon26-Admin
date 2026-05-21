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
import { useDatathon, FirstRoundSubmission } from "../contexts/DatathonContext";

export function FirstRoundSubmissions() {
  const { firstRoundSubmissions, updateFirstRoundResult } = useDatathon();
  const [mailDialogOpen, setMailDialogOpen] = useState(false);
  const [mailDialogType, setMailDialogType] = useState<"question" | "result">(
    "question",
  );
  const [confirmationText, setConfirmationText] = useState("");

  const requiredText =
    mailDialogType === "question"
      ? "Mail Question Round 1"
      : "Mail Result Round 1";

  const handleResultChange = (
    submissionId: string,
    newResult: FirstRoundSubmission["result"],
  ) => {
    updateFirstRoundResult(submissionId, newResult);
  };

  const openMailDialog = (type: "question" | "result") => {
    setMailDialogType(type);
    setConfirmationText("");
    setMailDialogOpen(true);
  };

  const handleMailConfirm = () => {
    // Handle mail sending logic here
    console.log(`Sending ${mailDialogType} email for Round 1`);
    setMailDialogOpen(false);
    setConfirmationText("");
  };

  const renderLink = (href?: string, className = "") => {
    if (!href) {
      return <span className="text-zinc-500">-</span>;
    }

    const label = href.replace(/^https?:\/\//, "").replace(/\/$/, "");
    return (
      <a
        href={href}
        rel="noopener noreferrer"
        target="_blank"
        className={`block truncate text-cyan-300 hover:text-cyan-200 hover:underline ${className}`}
        title={href}
      >
        {label}
      </a>
    );
  };

  const getResultBadge = (result: FirstRoundSubmission["result"]) => {
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

  return (
    <div className="p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-semibold mb-2">
            First Round Submissions
          </h2>
          <p className="text-zinc-400">
            Review and download first round submission files
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
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="text-2xl font-semibold">
            {firstRoundSubmissions.length}
          </div>
          <div className="text-sm text-zinc-400">Total Submissions</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="text-2xl font-semibold text-emerald-400">
            {firstRoundSubmissions.filter((s) => s.result === "pass").length}
          </div>
          <div className="text-sm text-zinc-400">Pass</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="text-2xl font-semibold text-red-400">
            {firstRoundSubmissions.filter((s) => s.result === "fail").length}
          </div>
          <div className="text-sm text-zinc-400">Fail</div>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
                <TableHead className="text-zinc-300">Team</TableHead>
                <TableHead className="text-zinc-300">PDF</TableHead>
                <TableHead className="text-zinc-300">GitHub</TableHead>
                <TableHead className="text-zinc-300">Presentation</TableHead>
                <TableHead className="text-zinc-300">Submitted</TableHead>
                <TableHead className="text-zinc-300">Result</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {firstRoundSubmissions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-zinc-400 py-8"
                  >
                    No submissions found
                  </TableCell>
                </TableRow>
              ) : (
                firstRoundSubmissions.map((submission) => (
                  <TableRow
                    key={submission.id}
                    className={`border-zinc-800 hover:opacity-90 ${
                      submission.result === "pass"
                        ? "bg-emerald-900/20 hover:bg-emerald-900/30"
                        : submission.result === "fail"
                          ? "bg-red-900/20 hover:bg-red-900/30"
                          : "hover:bg-zinc-800/30"
                    }`}
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
                    <TableCell className="w-[150px] max-w-[150px] text-zinc-400">
                      {renderLink(submission.pdfLink, "w-[150px]")}
                    </TableCell>
                    <TableCell className="w-[150px] max-w-[150px] text-zinc-400">
                      {renderLink(submission.githubLink, "w-[150px]")}
                    </TableCell>
                    <TableCell className="w-[150px] max-w-[150px] text-zinc-400">
                      {renderLink(submission.presentationLink, "w-[150px]")}
                    </TableCell>
                    <TableCell>
                      <div className="text-zinc-300">
                        {submission.submittedDate instanceof Date
                          ? submission.submittedDate.toLocaleDateString("vn-VN")
                          : "-"}
                      </div>
                      <div className="text-sm text-zinc-500 font-mono">
                        {submission.submittedDate instanceof Date
                          ? submission.submittedDate.toLocaleTimeString("vn-VN")
                          : "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={submission.result}
                        onValueChange={(value) =>
                          handleResultChange(
                            submission.id,
                            value as FirstRoundSubmission["result"],
                          )
                        }
                      >
                        <SelectTrigger className="w-[160px] bg-zinc-800 border-zinc-700 text-zinc-100">
                          <SelectValue>
                            {getResultBadge(submission.result)}
                          </SelectValue>
                        </SelectTrigger>

                        <SelectContent className="bg-zinc-800 border-zinc-700 w-[300px]">
                          <SelectItem
                            value="pending-review"
                            className="text-zinc-100 flex items-center gap-2"
                          >
                            <Badge className="bg-amber-900/50 text-amber-300 border-amber-800">
                              Pending Review
                            </Badge>
                          </SelectItem>
                          <SelectItem
                            value="pass"
                            className="text-zinc-100 flex items-center gap-2"
                          >
                            <Badge className="bg-emerald-900/50 text-emerald-300 border-emerald-800">
                              Pass
                            </Badge>
                          </SelectItem>
                          <SelectItem
                            value="fail"
                            className="text-zinc-100 flex items-center gap-2"
                          >
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
      </div>

      <div className="mt-4 text-sm text-zinc-400">
        Showing {firstRoundSubmissions.length} submissions
      </div>

      {/* Mail Confirmation Dialog */}
      <Dialog open={mailDialogOpen} onOpenChange={setMailDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
          <DialogHeader>
            <DialogTitle>
              Confirm {mailDialogType === "question" ? "Question" : "Result"}{" "}
              Email
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              This will send an email to all teams in First Round. To confirm,
              please type:{" "}
              <span className="font-semibold text-zinc-200">
                {requiredText}
              </span>
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
