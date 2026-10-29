

const API_URL = 'https://atomou-backend.onrender.com';


export type AuthUser = {
  id: string
  username: string
  email: string
  displayName: string
  avatar: string
}

type AuthResponse = {
  message: string
  token: string
  user: AuthUser
}

async function requestAuth(
  endpoint: 'signup' | 'login',
  data: Record<string, string>,
): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'Authentication failed')
  }

  return result as AuthResponse
}

export function signup(data: {
  username: string
  email: string
  password: string
  displayName: string
}) {
  return requestAuth('signup', data)
}

export function login(data: { email: string; password: string }) {
  return requestAuth('login', data)
}
