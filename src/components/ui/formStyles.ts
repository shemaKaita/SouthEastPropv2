/**
 * Shared form styling constants.
 *
 * Previously duplicated across ContactForm, EnquireNowForm, and LandlordEnquiryForm.
 */

export const inputClassName =
  "w-full rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-300 dark:border-white/20 px-4 py-3 h-12 text-sm text-[var(--text-primary)] placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-[var(--accent-yellow)] focus:ring-1 focus:ring-[var(--accent-yellow)] outline-none transition-all";

export const selectClassName = `${inputClassName} appearance-none bg-[length:20px] bg-[right_0.75rem_center] bg-no-repeat pr-10`;

export const labelClassName =
  "block text-xs font-semibold uppercase tracking-[0.15em] text-slate-700 dark:text-slate-300 mb-2";

export const errorClassName =
  "mt-1.5 text-xs font-medium text-red-500 dark:text-red-400";

export const chevronBg =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")";
