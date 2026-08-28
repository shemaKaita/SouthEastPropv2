"use client";

import { useState, useTransition } from "react";
import { Save } from "lucide-react";
import { updateSiteContentAction } from "@/actions/admin/settings";
import {
  labelClassName,
  serverErrorClassName,
} from "@/components/ui/formStyles";

type SettingsFormProps = {
  navItems: string;
  socialLinks: string;
  contactDetails: string;
};

type ContentKey = "nav_items" | "social_links" | "contact_details";

const fields: Array<{ key: ContentKey; label: string }> = [
  { key: "nav_items", label: "Navigation Items" },
  { key: "social_links", label: "Social Links" },
  { key: "contact_details", label: "Contact Details" },
];

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

  const handleChange = (key: ContentKey, value: string): void => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = (key: ContentKey): void => {
    setError(null);
    setSuccess(null);
    const formData = new FormData();
    formData.set("key", key);
    formData.set("value", values[key]);

    startTransition(async () => {
      const result = await updateSiteContentAction(formData);
      if (result.success) {
        setSuccess(`${fields.find((f) => f.key === key)?.label} saved.`);
      } else {
        setError(result.message);
      }
    });
  };

  return (
    <div className="space-y-6">
      {fields.map((field) => (
        <div
          key={field.key}
          className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5"
        >
          <label htmlFor={field.key} className={labelClassName}>
            {field.label}
          </label>
          <textarea
            id={field.key}
            value={values[field.key]}
            onChange={(e) => handleChange(field.key, e.target.value)}
            rows={8}
            className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)] px-4 py-3 font-mono text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-yellow)] focus:ring-1 focus:ring-[var(--accent-yellow)]"
          />
          <button
            type="button"
            onClick={() => handleSave(field.key)}
            disabled={isPending}
            className="text-navy-900 mt-3 inline-flex items-center gap-2 rounded-lg bg-[var(--accent-yellow)] px-4 py-2 text-sm font-bold hover:bg-[var(--accent-yellow-hover)] disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            Save
          </button>
        </div>
      ))}

      {error && <p className={serverErrorClassName}>{error}</p>}
      {success && (
        <p className="text-sm font-medium text-green-500">{success}</p>
      )}
    </div>
  );
}
