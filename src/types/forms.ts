/**
 * Form-related types shared across all form components and server actions.
 */

export type FormStatus = "idle" | "submitting" | "success" | "error";

export type FormErrors<T> = Partial<Record<keyof T, string>>;

export type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type EnquiryFormData = {
  name: string;
  email: string;
  moveInDate: string;
  message: string;
  propertySlug: string;
};

export type LandlordFormData = {
  name: string;
  email: string;
  phone: string;
  location: string;
  propertyType: string;
  units: string;
};

export type ActionResult<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>;
};
