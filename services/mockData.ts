/**
 * Placeholder fixtures for UI development.
 *
 * Everything here is fake. It exists so screens have realistic shapes to render
 * before the HighLevel/Supabase integration lands. Replace the bodies of the
 * hooks in `hooks/` with real calls and this file can be deleted wholesale.
 */
import type {
  ActivityItem,
  AppNotification,
  Appointment,
  Conversation,
  DashboardStats,
  Lead,
  Message,
  MissedCall,
  Rep,
  SocialPost,
  WebsiteRequest,
} from '../types/Models';

/** Offsets from "now" keep the relative timestamps sensible whenever the app runs. */
const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString();
const hoursFromNow = (h: number) => new Date(Date.now() + h * 3_600_000).toISOString();

export const mockDashboardStats: DashboardStats = {
  missedCallsToday: 3,
  recoveredToday: 2,
  newLeads: 12,
  bookedThisWeek: 4,
  revenueRecovered: 2400,
};

export const mockMissedCalls: MissedCall[] = [
  {
    id: 'mc1',
    callerName: null,
    phone: '(555) 0182',
    occurredAt: minutesAgo(2),
    textBackStatus: 'sent',
    recovered: false,
    conversationId: 'c1',
  },
  {
    id: 'mc2',
    callerName: 'Dana Whitfield',
    phone: '(555) 0148',
    occurredAt: minutesAgo(18),
    textBackStatus: 'sent',
    recovered: true,
    conversationId: 'c2',
  },
  {
    id: 'mc3',
    callerName: 'Marcus Lee',
    phone: '(555) 0192',
    occurredAt: minutesAgo(64),
    textBackStatus: 'sent',
    recovered: true,
    conversationId: 'c3',
  },
  {
    id: 'mc4',
    callerName: null,
    phone: '(555) 0171',
    occurredAt: minutesAgo(190),
    textBackStatus: 'failed',
    recovered: false,
    conversationId: null,
  },
];

export const mockConversations: Conversation[] = [
  {
    id: 'c1',
    contactName: '(555) 0182',
    channel: 'missed_call',
    lastMessage: "Sorry we missed your call! How can we help?",
    lastMessageAt: minutesAgo(2),
    unread: true,
  },
  {
    id: 'c2',
    contactName: 'Dana Whitfield',
    channel: 'sms',
    lastMessage: 'That works for me — see you Thursday.',
    lastMessageAt: minutesAgo(8),
    unread: true,
  },
  {
    id: 'c3',
    contactName: 'Marcus Lee',
    channel: 'sms',
    lastMessage: 'Can we move the appointment to 3pm?',
    lastMessageAt: minutesAgo(64),
    unread: true,
  },
  {
    id: 'c4',
    contactName: 'Priya Raman',
    channel: 'webchat',
    lastMessage: 'Thanks for the quick turnaround!',
    lastMessageAt: minutesAgo(240),
    unread: false,
  },
  {
    id: 'c5',
    contactName: 'Owen Bright',
    channel: 'messenger',
    lastMessage: 'Sending the paperwork over tonight.',
    lastMessageAt: minutesAgo(1500),
    unread: false,
  },
  {
    id: 'c6',
    contactName: 'Sofia Alvarez',
    channel: 'instagram',
    lastMessage: 'Got it, appreciate the update.',
    lastMessageAt: minutesAgo(2900),
    unread: false,
  },
];

export const mockMessages: Record<string, Message[]> = {
  c2: [
    {
      id: 'm1',
      conversationId: 'c2',
      body: 'Hi — are you open Saturday?',
      sentAt: minutesAgo(40),
      outbound: false,
      fromAI: false,
    },
    {
      id: 'm2',
      conversationId: 'c2',
      body: "Sorry we missed your call! We're open 9–2 on Saturday. Want me to book you in?",
      sentAt: minutesAgo(39),
      outbound: true,
      fromAI: true,
    },
    {
      id: 'm3',
      conversationId: 'c2',
      body: 'Yes please, Thursday would be better if you have it.',
      sentAt: minutesAgo(20),
      outbound: false,
      fromAI: false,
    },
    {
      id: 'm4',
      conversationId: 'c2',
      body: 'Booked you for Thursday at 10am. See you then!',
      sentAt: minutesAgo(9),
      outbound: true,
      fromAI: true,
    },
    {
      id: 'm5',
      conversationId: 'c2',
      body: 'That works for me — see you Thursday.',
      sentAt: minutesAgo(8),
      outbound: false,
      fromAI: false,
    },
  ],
};

export const mockLeads: Lead[] = [
  {
    id: 'l1',
    name: 'Sofia Alvarez',
    phone: '(555) 0148',
    email: null,
    stage: 'new',
    source: 'instagram',
    createdAt: minutesAgo(30),
    estimatedValue: 450,
  },
  {
    id: 'l2',
    name: 'Owen Bright',
    phone: null,
    email: 'owen@brightco.com',
    stage: 'contacted',
    source: 'messenger',
    createdAt: minutesAgo(300),
    estimatedValue: 1200,
  },
  {
    id: 'l3',
    name: 'Marcus Lee',
    phone: '(555) 0192',
    email: null,
    stage: 'booked',
    source: 'missed_call',
    createdAt: minutesAgo(600),
    estimatedValue: 800,
  },
  {
    id: 'l4',
    name: 'Nina Kowalski',
    phone: null,
    email: 'nina@kowalski.io',
    stage: 'new',
    source: 'webchat',
    createdAt: minutesAgo(900),
    estimatedValue: null,
  },
  {
    id: 'l5',
    name: 'Priya Raman',
    phone: '(555) 0110',
    email: null,
    stage: 'won',
    source: 'sms',
    createdAt: minutesAgo(4000),
    estimatedValue: 2400,
  },
  {
    id: 'l6',
    name: 'Dana Whitfield',
    phone: '(555) 0148',
    email: 'dana@whitfield.co',
    stage: 'booked',
    source: 'missed_call',
    createdAt: minutesAgo(120),
    estimatedValue: 600,
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: 'a1',
    title: 'Intro call',
    contactName: 'Dana Whitfield',
    startsAt: hoursFromNow(2),
    durationMinutes: 30,
    location: 'Phone',
    status: 'confirmed',
  },
  {
    id: 'a2',
    title: 'Site visit',
    contactName: 'Marcus Lee',
    startsAt: hoursFromNow(5),
    durationMinutes: 60,
    location: '412 Cedar St',
    status: 'confirmed',
  },
  {
    id: 'a3',
    title: 'Follow-up',
    contactName: 'Owen Bright',
    startsAt: hoursFromNow(8),
    durationMinutes: 30,
    location: 'Video',
    status: 'pending',
  },
  {
    id: 'a4',
    title: 'Consultation',
    contactName: 'Priya Raman',
    startsAt: hoursFromNow(26),
    durationMinutes: 45,
    location: 'Office',
    status: 'confirmed',
  },
  {
    id: 'a5',
    title: 'Quote review',
    contactName: 'Nina Kowalski',
    startsAt: hoursFromNow(30),
    durationMinutes: 30,
    location: 'Video',
    status: 'pending',
  },
];

export const mockActivity: ActivityItem[] = [
  {
    id: 'act1',
    title: 'New message from Dana Whitfield',
    occurredAt: minutesAgo(8),
    kind: 'message',
  },
  {
    id: 'act2',
    title: 'Appointment confirmed — Marcus Lee',
    occurredAt: minutesAgo(60),
    kind: 'appointment',
  },
  { id: 'act3', title: 'Contact added — Priya Raman', occurredAt: minutesAgo(180), kind: 'lead' },
  {
    id: 'act4',
    title: 'Missed call recovered — (555) 0182',
    occurredAt: minutesAgo(300),
    kind: 'missed_call',
  },
];

export const mockNotifications: AppNotification[] = [
  {
    id: 'n1',
    title: 'Missed call',
    body: '(555) 0182 called — text-back sent automatically.',
    receivedAt: minutesAgo(2),
    read: false,
  },
  {
    id: 'n2',
    title: 'New lead',
    body: 'Sofia Alvarez came in from Instagram.',
    receivedAt: minutesAgo(30),
    read: false,
  },
  {
    id: 'n3',
    title: 'Appointment booked',
    body: 'Zippy booked Dana Whitfield for Thursday 10am.',
    receivedAt: minutesAgo(120),
    read: true,
  },
];

export const mockSocialPosts: SocialPost[] = [
  {
    id: 'sp1',
    platform: 'facebook',
    prompt: 'Spring promo for new customers',
    body: "Spring's here and we're booking fast! New customers get 15% off their first visit this month. Tap to book — we'll take care of the rest.",
    createdAt: minutesAgo(2000),
  },
];

export const mockWebsiteRequests: WebsiteRequest[] = [
  {
    id: 'wr1',
    summary: 'Update hours on homepage',
    details: 'We now close at 2pm on Saturdays instead of 4pm.',
    status: 'complete',
    submittedAt: minutesAgo(6000),
  },
  {
    id: 'wr2',
    summary: 'Add new service photos',
    details: 'Six new photos from the Cedar St job — will email them over.',
    status: 'in_progress',
    submittedAt: minutesAgo(1500),
  },
];

export const mockReps: Rep[] = [
  {
    id: 'r1',
    name: 'John Carter',
    referralSlug: 'john',
    clicks: 412,
    leads: 38,
    appointments: 21,
    sales: 9,
    commission: 1350,
  },
  {
    id: 'r2',
    name: 'Sarah Nguyen',
    referralSlug: 'sarah',
    clicks: 587,
    leads: 52,
    appointments: 30,
    sales: 14,
    commission: 2100,
  },
  {
    id: 'r3',
    name: 'Diego Marín',
    referralSlug: 'diego',
    clicks: 208,
    leads: 17,
    appointments: 8,
    sales: 3,
    commission: 450,
  },
];
