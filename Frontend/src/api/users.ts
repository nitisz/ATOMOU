const API_BASE_URL = 'http://localhost:4001/api'

export type ChatUser = {
  id: string
  username: string
  displayName: string
  avatar: string
}

export type ApiMessage = {
  id: string
  senderId: string
  recipientId: string
  text: string
  createdAt: string
}

export async function getUsers(token: string): Promise<ChatUser[]> {
  const response = await fetch(`${API_BASE_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'Unable to load users')
  }

  return result.users as ChatUser[]
}

export async function getMessages(
  token: string,
  userId: string,
): Promise<ApiMessage[]> {
  const response = await fetch(
    `${API_BASE_URL}/messages/${encodeURIComponent(userId)}`,
    { headers: { Authorization: `Bearer ${token}` } },
  )

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'Unable to load messages')
  }

  return result.messages as ApiMessage[]
}
