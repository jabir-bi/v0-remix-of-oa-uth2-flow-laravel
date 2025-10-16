export interface Permission {
  id: string
  name: string
  description: string
  category: string
  roleCount: number
  createdAt: string
}

export async function getPermissions(): Promise<Permission[]> {
  const response = await fetch("/api/permissions")
  if (!response.ok) throw new Error("Failed to fetch permissions")
  return response.json()
}

export async function createPermission(data: Partial<Permission>): Promise<Permission> {
  const response = await fetch("/api/permissions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to create permission")
  return response.json()
}

export async function updatePermission(id: string, data: Partial<Permission>): Promise<Permission> {
  const response = await fetch(`/api/permissions/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to update permission")
  return response.json()
}

export async function deletePermission(id: string): Promise<void> {
  const response = await fetch(`/api/permissions/${id}`, { method: "DELETE" })
  if (!response.ok) throw new Error("Failed to delete permission")
}

export async function assignPermissionToRoles(permissionId: string, roleIds: string[]): Promise<void> {
  const response = await fetch(`/api/permissions/${permissionId}/roles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ roles: roleIds }),
  })
  if (!response.ok) throw new Error("Failed to assign permission to roles")
}
