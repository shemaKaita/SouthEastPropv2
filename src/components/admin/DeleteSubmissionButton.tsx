"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteSubmissionAction } from "@/actions/admin/submissions";

type DeleteSubmissionButtonProps = {
  type: "contact" | "enquiry" | "landlord";
  id: number;
};

export default function DeleteSubmissionButton({
  type,
  id,
}: DeleteSubmissionButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  const handleDelete = (): void => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    startTransition(async () => {
      await deleteSubmissionAction(type, id);
      setConfirming(false);
    });
  };

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-1">
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="rounded bg-red-500 px-2 py-1 text-xs font-medium text-white"
        >
          {isPending ? "…" : "Confirm?"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="rounded px-2 py-1 text-xs text-[var(--text-secondary)]"
        >
          Cancel
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="rounded p-1.5 text-red-500 hover:bg-red-500/10"
      aria-label="Delete submission"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
