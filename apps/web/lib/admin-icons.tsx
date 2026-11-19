import {
  Briefcase,
  Building2,
  CalendarDays,
  FileDown,
  GalleryHorizontalEnd,
  Handshake,
  Hash,
  Images,
  Info,
  LayoutDashboard,
  Layers,
  KeyRound,
  LifeBuoy,
  Mail,
  MapPin,
  MessageSquareWarning,
  Newspaper,
  Settings,
  Sparkles,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";
import type { AdminNavIcon } from "./admin-nav";

const NAV_ICONS: Record<AdminNavIcon, LucideIcon> = {
  dashboard: LayoutDashboard,
  articles: Newspaper,
  downloads: FileDown,
  opportunities: Briefcase,
  events: CalendarDays,
  albums: Images,
  videos: Video,
  slideshow: GalleryHorizontalEnd,
  featured: Sparkles,
  partners: Handshake,
  memberOrgs: Building2,
  team: Users,
  programmes: Layers,
  youthSpaces: MapPin,
  about: Info,
  figures: Hash,
  settings: Settings,
  account: KeyRound,
  inquiries: Mail,
  complaints: MessageSquareWarning,
  help: LifeBuoy,
};

export function AdminIcon({
  name,
  size = 18,
  strokeWidth = 1.75,
  className,
}: {
  name: AdminNavIcon;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  const Icon = NAV_ICONS[name];
  return <Icon size={size} strokeWidth={strokeWidth} className={className} aria-hidden />;
}
