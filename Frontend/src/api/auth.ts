const API_URL = 'https://atomou-backend.onrender.com/api/auth';

export type AuthUser = {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatar: string;
};

type AuthResponse = {
  message: string;
  token: string;
  user: AuthUser;
};

async function requestAuth(
  endpoint: 'signup' | 'login',
  data: Record<string, string>,
): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    const text = await response.text();
    console.error('Auth API returned non-JSON:', response.status, text.slice(0, 300));

    throw new Error(
      `Server returned an unexpected response (${response.status}). Check the API URL and backend route.`,
    );
  }

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Authentication failed');
  }

  return result as AuthResponse;
}

export function signup(data: {
  username: string;
  email: string;
  password: string;
  displayName: string;
}) {
  return requestAuth('signup', data);
}

export function login(data: { email: string; password: string }) {
  return requestAuth('login', data);
}