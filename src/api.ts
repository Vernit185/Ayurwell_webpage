import axios from 'axios';
import type { ChatRequest, FollowupRequest, AyurWellResponse } from './types/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (data: URLSearchParams) => {
  const response = await apiClient.post('/auth/login', data, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  return response.data;
};

export const signup = async (data: any) => {
  const response = await apiClient.post('/auth/signup', data);
  return response.data;
};

export const fetchConversations = async () => {
  const response = await apiClient.get('/conversations/');
  return response.data;
};

export const createConversation = async (title: string = "New Conversation") => {
  const response = await apiClient.post('/conversations/', { title });
  return response.data;
};

export const fetchConversationDetail = async (id: string) => {
  const response = await apiClient.get(`/conversations/${id}`);
  return response.data;
};

export const deleteConversation = async (id: string) => {
  const response = await apiClient.delete(`/conversations/${id}`);
  return response.data;
};

export const submitChatQuery = async (request: ChatRequest): Promise<AyurWellResponse> => {
  const response = await apiClient.post('/chat', request);
  return response.data;
};

export const submitFollowup = async (request: FollowupRequest): Promise<AyurWellResponse> => {
  const response = await apiClient.post('/followup', request);
  return response.data;
};

export const resetSession = async (sessionId: string): Promise<void> => {
  await apiClient.post(`/reset?session_id=${sessionId}`);
};
