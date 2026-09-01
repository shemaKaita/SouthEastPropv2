"use client";

import { useState, useTransition } from "react";
import { Save, AlertCircle, RotateCcw } from "lucide-react";
import { updateSiteContentAction } from "@/actions/admin/settings";
import { labelClassName } from "@/components/ui/formStyles";

type SettingsFormProps = {
  navItems: string;
  socialLinks: string;
  contactDetails: string;
};

type ContentKey = "nav_items" | "social_links" | "contact_details";

type FieldDef = {
  key: ContentKey;
  label: string;
  description: string;
  schema: string;
};

const fields: FieldDef[] = [
  {
    key: "nav_items",
    label: "Navigation Items",
    description: "Top-bar navigation entries shown across the public site.",
    schema: "Array<{ href: string; label: string; number?: string }>",
  },
  {
    key: "social_links",
    label: "Social Links",
    description: "Footer social-media icons.",
    schema: "Array<{ platform: string; href: string; label: string }>",
  },
  {
    key: "contact_details",
    label: "Contact Details",
    description: "Footer contact-info items (phone, email, address).",
    schema:
      "Array<{ label: string; text: string; href: string; detail: string }>",
  },
];

function validateJson(value: string): string | null {
  try {
    JSON.parse(value);
    return null;
  } catch (err) {
    return err instanceof Error ? err.message : "Invalid JSON";
  }
}

export default function SettingsForm({
  navItems,
  socialLinks,
  contactDetails,
}: SettingsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [values, setValues] = useState<Record<ContentKey, string>>({
    nav_items: navItems,
    social_links: socialLinks,
    contact_details: contactDetails,
  });
  const [jsonErrors, setJsonErrors] = useState<
    Record<ContentKey, string | null>
  >({
    nav_items: null,
    social_links: null,
    contact_details: null,
  });

  const handleChange = (key: ContentKey, value: string): void => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setJsonErrors((prev) => ({ ...prev, [key]: validateJson(value) }));
  };

  const handleReset = (key: ContentKey): void => {
    const original: Record<ContentKey, string> = {
      nav_items: navItems,
      social_links: socialLinks,
      contact_details: contactDetails,
    };
    handleChange(key, original[key]);
  };

  const handleSave = (key: ContentKey): void => {
    setError(null);
    setSuccess(null);
    const validationError = validateJson(values[key]);
    if (validationError) {
      setJsonErrors((prev) => ({ ...prev, [key]: validationError }));
      setError(`Cannot save ${key}: invalid JSON.`);
      return;
    }
    const formData = new FormData();
    formData.set("key", key);
    formData.set("value", values[key]);

    startTransition(async () => {
      const result = await updateSiteContentAction(formData);
      if (result.success) {
        setSuccess(
          `${fields.find((f) => f.key === key)?.label} saved successfully.`,
        );
      } else {
        setError(result.message);
      }
    });
  };

  return (
    <div className="space-y-6">
      {fields.map((field) => {
        const jsonError = jsonErrors[field.key];
        const isDirty =
          values[field.key] !==
          (field.key === "nav_items"
            ? navItems
            : field.key === "social_links"
              ? socialLinks
              : contactDetails);
        return (
          <section
            key={field.key}
            className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5"
          >
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <div>
                <label htmlFor={field.key} className={labelClassName}>
                  {field.label}
                </label>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                  {field.description}
                </p>
                <p className="mt-1 font-mono text-[11px] break-words text-slate-500 dark:text-slate-400">
                  Schema: {field.schema}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleReset(field.key)}
                  disabled={!isDirty || isPending}
                  aria-label={`Reset ${field.label} to defaults`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-base)] hover:text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:text-slate-200"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => handleSave(field.key)}
                  disabled={isPending || jsonError !== null}
                  aria-label={`Save ${field.label}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-yellow)] px-4 py-2 text-sm font-bold text-[var(--brand-navy)] transition-all hover:bg-[var(--accent-yellow-hover)] disabled:cursor-not-allowed disabled:opacity-60 dark:text-slate-900"
                >
                  <Save className="h-4 w-4" />
                  Save
                </button>
              </div>
            </div>
            <textarea
              id={field.key}
              value={values[field.key]}
              onChange={(e) => handleChange(field.key, e.target.value)}
              spellCheck={false}
              rows={14}
              aria-invalid={jsonError !== null}
              aria-describedby={
                jsonError ? `${field.key}-error` : `${field.key}-hint`
              }
              className={`w-full resize-y overflow-y-auto rounded-lg border bg-[var(--bg-base)] px-4 py-3 font-mono text-sm leading-6 text-[var(--text-primary)] transition-colors outline-none focus:ring-1 ${
                jsonError
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-[var(--border-subtle)] focus:border-[var(--accent-yellow)] focus:ring-[var(--accent-yellow)]"
              }`}
            />
            {jsonError ? (
              <p
                id={`${field.key}-error`}
                role="alert"
                className="mt-2 inline-flex items-start gap-1.5 text-xs font-medium text-red-500 dark:text-red-400"
              >
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>{jsonError}</span>
              </p>
            ) : (
              <p
                id={`${field.key}-hint`}
                className="mt-2 text-xs text-[var(--text-secondary)]"
              >
                {values[field.key].split("\n").length - 1} lines ·{" "}
                {values[field.key].length} characters
              </p>
            )}
          </section>
        );
      })}

      {error && (
        <p
          role="alert"
          className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-500 dark:text-red-400"
        >
          {error}
        </p>
      )}
      {success && (
        <p
          role="status"
          className="rounded-lg border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm font-medium text-green-600 dark:text-green-400"
        >
          {success}
        </p>
      )}
    </div>
  );
}
