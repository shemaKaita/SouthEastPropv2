import {
  Globe,
  AtSign,
  Send,
  Share2,
  MapPin,
  Phone,
  Mail,
  type LucideIcon,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { SOCIAL_LINKS, CONTACT_DETAILS } from "@/lib/constants";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

/** Social media icon mapping — shared by Footer and Contact page */
export const SOCIAL_ICONS: Record<string, IconComponent> = {
  Facebook: Globe as IconComponent,
  Instagram: AtSign as IconComponent,
  "X (Twitter)": Send as IconComponent,
  LinkedIn: Share2 as IconComponent,
};

/** Contact detail icon mapping — shared by Footer and Contact page */
export const CONTACT_ICONS: Record<string, LucideIcon> = {
  Address: MapPin,
  Phone: Phone,
  Email: Mail,
};

/** Social links with resolved icon components */
export const SOCIAL_LINKS_WITH_ICONS = SOCIAL_LINKS.map((social) => ({
  ...social,
  icon: SOCIAL_ICONS[social.label],
}));

/** Contact details with resolved icon components */
export const CONTACT_DETAILS_WITH_ICONS = CONTACT_DETAILS.map((detail) => ({
  ...detail,
  icon: CONTACT_ICONS[detail.label],
}));