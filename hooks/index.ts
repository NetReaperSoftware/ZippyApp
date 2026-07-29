/**
 * Data hooks for MyZippy screens.
 *
 * These currently serve fixtures from `services/mockData`. Each is the single
 * place to swap in a HighLevel or Supabase call — screens consume only the
 * `Resource<T>` shape and stay untouched when that happens.
 */
import {
  mockActivity,
  mockAppointments,
  mockConversations,
  mockDashboardStats,
  mockLeads,
  mockMessages,
  mockMissedCalls,
  mockNotifications,
  mockReps,
  mockSocialPosts,
  mockWebsiteRequests,
} from '../services/mockData';
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
import { useMockResource, type Resource } from './useMockResource';

export type { Resource };

export const useDashboardStats = (): Resource<DashboardStats> =>
  useMockResource(mockDashboardStats);

export const useActivity = (): Resource<ActivityItem[]> => useMockResource(mockActivity);

export const useMissedCalls = (): Resource<MissedCall[]> => useMockResource(mockMissedCalls);

export const useConversations = (): Resource<Conversation[]> =>
  useMockResource(mockConversations);

export const useMessages = (conversationId: string): Resource<Message[]> =>
  useMockResource(mockMessages[conversationId] ?? []);

export const useLeads = (): Resource<Lead[]> => useMockResource(mockLeads);

export const useAppointments = (): Resource<Appointment[]> => useMockResource(mockAppointments);

export const useNotifications = (): Resource<AppNotification[]> =>
  useMockResource(mockNotifications);

export const useSocialPosts = (): Resource<SocialPost[]> => useMockResource(mockSocialPosts);

export const useWebsiteRequests = (): Resource<WebsiteRequest[]> =>
  useMockResource(mockWebsiteRequests);

export const useReps = (): Resource<Rep[]> => useMockResource(mockReps);
