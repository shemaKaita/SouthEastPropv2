"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, LogIn } from "lucide-react";
import { loginAction } from "@/actions/admin/auth";
import {
  inputClassName,
  labelClassName,
  submitButtonClassName,
  serverErrorClassName,
} from "@/components/ui/formStyles";

type LoginFormProps = {
  redirectTo: string;
};

export default function LoginForm({ redirectTo }: LoginFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await loginAction(formData);
      if (result.success) {
        router.push(redirectTo);
        router.refresh();
      } else {
        setError(result.message);
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 shadow-lg"
    >
      <div>
        <label htmlFor="email" className={labelClassName}>
          Email
        </label>
        <div className="relative">
          <Mail
            className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-[var(--text-secondary)]"
            aria-hidden
          />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={`${inputClassName} pl-11 text-[13px] sm:text-sm`}
            placeholder="admin@southeastproperties.co.za"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className={labelClassName}>
          Password
        </label>
        <div className="relative">
          <Lock
            className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-[var(--text-secondary)]"
            aria-hidden
          />
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className={`${inputClassName} pl-11`}
            placeholder="••••••••"
          />
        </div>
      </div>

      {error && <p className={serverErrorClassName}>{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className={submitButtonClassName}
      >
        <LogIn className="h-4 w-4" />
        {isPending ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
