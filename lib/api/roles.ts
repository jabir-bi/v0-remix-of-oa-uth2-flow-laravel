export interface Role {
  id: string
  name: string
  description: string
  userCount: number
  permissionCount: number
  permissions: string[]
  createdAt: string
}

export async function getRoles(): Promise<Role[]> {
  const response = await fetch("/api/roles")
  if (!response.ok) throw new Error("Failed to fetch roles")
  return response.json()
}

export async function createRole(data: Partial<Role>): Promise<Role> {
  const response = await fetch("/api/roles", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to create role")
  return response.json()
}

export async function updateRole(id: string, data: Partial<Role>): Promise<Role> {
  const response = await fetch(`/api/roles/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to update role")
  return response.json()
}

export async function deleteRole(id: string): Promise<void> {
  const response = await fetch(`/api/roles/${id}`, { method: "DELETE" })
  if (!response.ok) throw new Error("Failed to delete role")
}

export async function assignPermissionsToRole(roleId: string, permissionIds: string[]): Promise<void> {
  const response = await fetch(`/api/roles/${roleId}/permissions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ permissions: permissionIds }),
  })
  if (!response.ok) throw new Error("Failed to assign permissions")
}
