import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { AyurWellResponse } from '../types/api';
import { submitChatQuery, submitFollowup, resetSession } from '../api';

export function useAyurWell() {
  const [sessionId] = useState<string>(uuidv4());
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<AyurWellResponse | null>(null);

  const sendQuery = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await submitChatQuery({ session_id: sessionId, query });
      setResponse(res);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const sendFollowup = async (answers: Record<string, boolean>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await submitFollowup({ session_id: sessionId, answers });
      setResponse(res);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const reset = async () => {
    setLoading(true);
    try {
      await resetSession(sessionId);
      setResponse(null);
      setError(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { sessionId, loading, error, response, sendQuery, sendFollowup, reset };
}
