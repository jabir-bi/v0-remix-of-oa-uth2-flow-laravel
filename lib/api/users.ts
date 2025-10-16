export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
  status: "active" | "inactive"
  lastLogin: string
  permissions: string[]
  createdAt: string
}

export async function getUsers(): Promise<User[]> {
  const response = await fetch("/api/users")
  if (!response.ok) throw new Error("Failed to fetch users")
  return response.json()
}

export async function createUser(data: Partial<User>): Promise<User> {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to create user")
  return response.json()
}

export async function updateUser(id: string, data: Partial<User>): Promise<User> {
  const response = await fetch(`/api/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to update user")
  return response.json()
}

export async function deleteUser(id: string): Promise<void> {
  const response = await fetch(`/api/users/${id}`, { method: "DELETE" })
  if (!response.ok) throw new Error("Failed to delete user")
}

export async function assignRolesToUser(userId: string, roleIds: string[]): Promise<void> {
  const response = await fetch(`/api/users/${userId}/roles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ roles: roleIds }),
  })
  if (!response.ok) throw new Error("Failed to assign roles")
}

export async function assignPermissionsToUser(userId: string, permissionIds: string[]): Promise<void> {
  const response = await fetch(`/api/users/${userId}/permissions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ permissions: permissionIds }),
  })
  if (!response.ok) throw new Error("Failed to assign permissions")
}
