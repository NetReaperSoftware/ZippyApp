import type { Channel, LeadStage } from '../types/Models';

/** Compact relative time for list rows: "now", "8m", "3h", "2d". */
export function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60_000);

  if (minutes < 1) {
    return 'now';
  }
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.round(minutes / 60);
  if (hours < 24) {
    return `${hours}h`;
  }

  return `${Math.round(hours / 24)}d`;
}

/** Clock time for appointment rows, e.g. "9:00 AM". */
export function clockTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

/** Groups appointments under "Today" / "Tomorrow" / a weekday name. */
export function dayLabel(iso: string): string {
  const date = new Date(iso);
  const today = new Date();
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const dayDiff = Math.round((startOfDay(date) - startOfDay(today)) / 86_400_000);

  if (dayDiff === 0) {
    return 'Today';
  }
  if (dayDiff === 1) {
    return 'Tomorrow';
  }
  return date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
}

export function currency(amount: number): string {
  return `$${amount.toLocaleString()}`;
}

/** Up to two initials for avatar placeholders. */
export function initialsOf(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export const CHANNEL_LABELS: Record<Channel, string> = {
  sms: 'SMS',
  webchat: 'Web',
  messenger: 'Messenger',
  instagram: 'Instagram',
  missed_call: 'Call',
};

export const CHANNEL_ICONS: Record<Channel, string> = {
  sms: 'chatbubble',
  webchat: 'globe',
  messenger: 'logo-facebook',
  instagram: 'logo-instagram',
  missed_call: 'call',
};

export const LEAD_STAGE_LABELS: Record<LeadStage, string> = {
  new: 'New',
  contacted: 'Contacted',
  booked: 'Booked',
  won: 'Won',
  lost: 'Lost',
};
