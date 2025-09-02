import { useState, useEffect } from 'react';
import { useAuth } from '@/react-app/contexts/AuthContext';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
}

export const useApi = <T>(endpoint: string, options: ApiOptions = {}) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const requestOptions: RequestInit = {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': user.id,
          ...options.headers,
        },
      };

      if (options.body) {
        requestOptions.body = JSON.stringify(options.body);
      }

      const response = await fetch(endpoint, requestOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint, user]);

  return { data, loading, error, refetch: fetchData };
};

export const useApiMutation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const mutate = async <T>(endpoint: string, options: ApiOptions = {}): Promise<T | null> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      setLoading(true);
      setError(null);

      const requestOptions: RequestInit = {
        method: options.method || 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': user.id,
          ...options.headers,
        },
      };

      if (options.body) {
        requestOptions.body = JSON.stringify(options.body);
      }

      const response = await fetch(endpoint, requestOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
};
