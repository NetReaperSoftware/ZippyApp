/**
 * Domain models for MyZippy.
 *
 * These mirror the concepts in the launch blueprint (missed-call recovery,
 * unified inbox, lead pipeline, booking, social, reps) and are the contract
 * between screens and the data layer. Screens read these types only — swapping
 * `services/mockData` for HighLevel APIs should not change them.
 */

/** Where a conversation or message originated. Mirrors the blueprint's unified-inbox sources. */
export type Channel = 'sms' | 'webchat' | 'messenger' | 'instagram' | 'missed_call';

export type LeadStage = 'new' | 'contacted' | 'booked' | 'won' | 'lost';

/** Delivery state of the automatic missed-call text-back. */
export type TextBackStatus = 'sent' | 'pending' | 'failed';

export type AppointmentStatus = 'confirmed' | 'pending' | 'cancelled';

export type SocialPlatform = 'facebook' | 'instagram' | 'linkedin' | 'google_business';

export type UserRole = 'owner' | 'admin' | 'rep';

export interface MissedCall {
  id: string;
  callerName: string | null;
  phone: string;
  /** ISO 8601. */
  occurredAt: string;
  textBackStatus: TextBackStatus;
  /** True once the caller replied to the automatic text-back. */
  recovered: boolean;
  conversationId: string | null;
}

export interface Lead {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  stage: LeadStage;
  source: Channel;
  /** ISO 8601. */
  createdAt: string;
  estimatedValue: number | null;
}

export interface Message {
  id: string;
  conversationId: string;
  body: string;
  /** ISO 8601. */
  sentAt: string;
  /** True when sent by the business (owner or Zippy AI) rather than the customer. */
  outbound: boolean;
  /** Outbound messages drafted and sent by the assistant. */
  fromAI: boolean;
}

export interface Conversation {
  id: string;
  contactName: string;
  channel: Channel;
  lastMessage: string;
  /** ISO 8601. */
  lastMessageAt: string;
  unread: boolean;
}

export interface Appointment {
  id: string;
  title: string;
  contactName: string;
  /** ISO 8601. */
  startsAt: string;
  durationMinutes: number;
  location: string;
  status: AppointmentStatus;
}

export interface SocialPost {
  id: string;
  platform: SocialPlatform;
  prompt: string;
  body: string;
  /** ISO 8601. */
  createdAt: string;
}

export interface WebsiteRequest {
  id: string;
  summary: string;
  details: string;
  status: 'submitted' | 'in_progress' | 'complete';
  /** ISO 8601. */
  submittedAt: string;
}

export interface Rep {
  id: string;
  name: string;
  referralSlug: string;
  clicks: number;
  leads: number;
  appointments: number;
  sales: number;
  commission: number;
}

export interface DashboardStats {
  missedCallsToday: number;
  recoveredToday: number;
  newLeads: number;
  bookedThisWeek: number;
  revenueRecovered: number;
  /** Totals shown in the dashboard tile grid. */
  contacts: number;
  appointments: number;
  messages: number;
  aiReplies: number;
}

export interface ActivityItem {
  id: string;
  title: string;
  /** ISO 8601. */
  occurredAt: string;
  kind: 'message' | 'appointment' | 'lead' | 'missed_call';
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  /** ISO 8601. */
  receivedAt: string;
  read: boolean;
}
