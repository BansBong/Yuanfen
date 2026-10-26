import {
  Briefcase,
  Building2,
  Camera,
  Compass,
  FileText,
  GraduationCap,
  Handshake,
  Hospital,
  Info,
  Lock,
  MapPin,
  Map,
  MessageCircle,
  MoonStar,
  Plane,
  Route,
  Send,
  ShieldCheck,
  ShoppingBag,
  Users,
  CircleHelp,
  type LucideIcon,
} from "lucide-react";
import type { IconName } from "@/data/nav";

const ICONS: Record<IconName, LucideIcon> = {
  compass: Compass,
  "shopping-bag": ShoppingBag,
  hospital: Hospital,
  "graduation-cap": GraduationCap,
  map: Map,
  "map-pin": MapPin,
  route: Route,
  users: Users,
  handshake: Handshake,
  info: Info,
  message: MessageCircle,
  help: CircleHelp,
  lock: Lock,
  shield: ShieldCheck,
  camera: Camera,
  briefcase: Briefcase,
  moon: MoonStar,
  plane: Plane,
  building: Building2,
  file: FileText,
  send: Send,
};

/** Decorative icon; always pair it with a visible text label. */
export function Icon({ name, className = "size-6" }: { name: IconName; className?: string }) {
  const Cmp = ICONS[name];
  return <Cmp aria-hidden="true" className={className} strokeWidth={1.75} />;
}
