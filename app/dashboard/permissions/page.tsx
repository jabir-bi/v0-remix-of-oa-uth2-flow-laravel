"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DataTable, type Column } from "@/components/access-control/data-table"
import { ActionMenu, type ActionMenuItem } from "@/components/access-control/action-menu"
import { DeleteConfirmDialog } from "@/components/access-control/delete-confirm-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Eye, Edit, UserCog, Trash2, Key } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Permission } from "@/lib/api/permissions"

const mockPermissions: Permission[] = [
  {
    id: "1",
    name: "users.view",
    description: "View users list and details",
    category: "Users",
    roleCount: 4,
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    name: "users.create",
    description: "Create new users",
    category: "Users",
    roleCount: 2,
    createdAt: "2024-01-01",
  },
  {
    id: "3",
    name: "users.edit",
    description: "Edit user information",
    category: "Users",
    roleCount: 2,
    createdAt: "2024-01-01",
  },
  {
    id: "4",
    name: "users.delete",
    description: "Delete users from system",
    category: "Users",
    roleCount: 1,
    createdAt: "2024-01-01",
  },
  {
    id: "5",
    name: "roles.view",
    description: "View roles list and details",
    category: "Roles",
    roleCount: 3,
    createdAt: "2024-01-01",
  },
  {
    id: "6",
    name: "roles.create",
    description: "Create new roles",
    category: "Roles",
    roleCount: 1,
    createdAt: "2024-01-01",
  },
  {
    id: "7",
    name: "roles.edit",
    description: "Edit role information",
    category: "Roles",
    roleCount: 1,
    createdAt: "2024-01-01",
  },
  {
    id: "8",
    name: "roles.delete",
    description: "Delete roles from system",
    category: "Roles",
    roleCount: 1,
    createdAt: "2024-01-01",
  },
  {
    id: "9",
    name: "permissions.view",
    description: "View permissions list",
    category: "Permissions",
    roleCount: 2,
    createdAt: "2024-01-01",
  },
  {
    id: "10",
    name: "permissions.manage",
    description: "Manage permission assignments",
    category: "Permissions",
    roleCount: 1,
    createdAt: "2024-01-01",
  },
]

const availableRoles = [
  { id: "1", name: "Admin" },
  { id: "2", name: "Manager" },
  { id: "3", name: "Editor" },
  { id: "4", name: "Viewer" },
]

export default function PermissionsPage() {
  const { toast } = useToast()
  const [permissions, setPermissions] = React.useState<Permission[]>(mockPermissions)
  const [selectedPermission, setSelectedPermission] = React.useState<Permission | undefined>()
  const [permissionFormOpen, setPermissionFormOpen] = React.useState(false)
  const [viewDialogOpen, setViewDialogOpen] = React.useState(false)
  const [assignRolesOpen, setAssignRolesOpen] = React.useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [formData, setFormData] = React.useState({ name: "", description: "", category: "Users" })
  const [selectedRoles, setSelectedRoles] = React.useState<string[]>([])
  const [loading, setLoading] = React.useState(false)

  const handleCreatePermission = () => {
    setSelectedPermission(undefined)
    setFormData({ name: "", description: "", category: "Users" })
    setPermissionFormOpen(true)
  }

  const handleEditPermission = (permission: Permission) => {
    setSelectedPermission(permission)
    setFormData({ name: permission.name, description: permission.description, category: permission.category })
    setPermissionFormOpen(true)
  }

  const handleViewPermission = (permission: Permission) => {
    setSelectedPermission(permission)
    setViewDialogOpen(true)
  }

  const handleAssignToRoles = (permission: Permission) => {
    setSelectedPermission(permission)
    setSelectedRoles([])
    setAssignRolesOpen(true)
  }

  const handleDeletePermission = (permission: Permission) => {
    setSelectedPermission(permission)
    setDeleteDialogOpen(true)
  }

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: selectedPermission ? "Permission updated" : "Permission created",
        description: selectedPermission
          ? "The permission has been updated successfully."
          : "The permission has been created successfully.",
      })

      setPermissionFormOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAssignRoles = async () => {
    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Roles updated",
        description: `The permission has been assigned to ${selectedRoles.length} role(s).`,
      })

      setAssignRolesOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign roles. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const columns: Column<Permission>[] = [
    {
      header: "Permission Name",
      accessor: (permission) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Key className="h-5 w-5 text-primary" />
          </div>
          <div>
            <code className="rounded bg-muted px-2 py-1 text-sm font-mono font-medium">{permission.name}</code>
            <p className="mt-1 text-sm text-muted-foreground">{permission.description}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Category",
      accessor: (permission) => (
        <Badge variant="secondary" className="font-medium">
          {permission.category}
        </Badge>
      ),
    },
    {
      header: "Roles",
      accessor: (permission) => (
        <Badge variant="outline" className="font-medium">
          {permission.roleCount} roles
        </Badge>
      ),
    },
    {
      header: "Actions",
      accessor: (permission) => {
        const actions: ActionMenuItem[] = [
          {
            label: "View Details",
            icon: <Eye className="h-4 w-4" />,
            onClick: () => handleViewPermission(permission),
          },
          {
            label: "Edit Permission",
            icon: <Edit className="h-4 w-4" />,
            onClick: () => handleEditPermission(permission),
          },
          {
            label: "Assign to Roles",
            icon: <UserCog className="h-4 w-4" />,
            onClick: () => handleAssignToRoles(permission),
          },
          {
            label: "Delete Permission",
            icon: <Trash2 className="h-4 w-4" />,
            onClick: () => handleDeletePermission(permission),
            variant: "destructive",
          },
        ]
        return <ActionMenu items={actions} />
      },
      className: "w-[70px]",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Permissions</h1>
            <p className="text-muted-foreground">Manage system permissions and access control</p>
          </div>
          <Button onClick={handleCreatePermission}>
            <Plus className="mr-2 h-4 w-4" />
            Add Permission
          </Button>
        </div>

        <DataTable data={permissions} columns={columns} searchPlaceholder="Search permissions..." />

        <Dialog open={permissionFormOpen} onOpenChange={setPermissionFormOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{selectedPermission ? "Edit Permission" : "Create Permission"}</DialogTitle>
              <DialogDescription>
                {selectedPermission
                  ? "Update the permission information below."
                  : "Add a new permission to the system."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Permission Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., users.view"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this permission allows"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Users">Users</SelectItem>
                    <SelectItem value="Roles">Roles</SelectItem>
                    <SelectItem value="Permissions">Permissions</SelectItem>
                    <SelectItem value="System">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setPermissionFormOpen(false)} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : selectedPermission ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {selectedPermission && (
          <>
            <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Permission Details</DialogTitle>
                  <DialogDescription>View permission information and assigned roles.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground">Permission Name</Label>
                    <code className="mt-1 block rounded bg-muted px-3 py-2 font-mono text-sm">
                      {selectedPermission.name}
                    </code>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Description</Label>
                    <p className="mt-1">{selectedPermission.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Category</Label>
                      <p className="mt-1 text-lg font-medium">{selectedPermission.category}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Assigned Roles</Label>
                      <p className="mt-1 text-lg font-medium">{selectedPermission.roleCount}</p>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={assignRolesOpen} onOpenChange={setAssignRolesOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Assign to Roles</DialogTitle>
                  <DialogDescription>Select roles to assign this permission to.</DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[400px] pr-4">
                  <div className="space-y-4">
                    {availableRoles.map((role) => (
                      <div key={role.id} className="flex items-center space-x-3 rounded-lg border p-4">
                        <Checkbox
                          id={role.id}
                          checked={selectedRoles.includes(role.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedRoles([...selectedRoles, role.id])
                            } else {
                              setSelectedRoles(selectedRoles.filter((id) => id !== role.id))
                            }
                          }}
                        />
                        <Label htmlFor={role.id} className="flex-1 cursor-pointer font-medium">
                          {role.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setAssignRolesOpen(false)} disabled={loading}>
                    Cancel
                  </Button>
                  <Button onClick={handleAssignRoles} disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <DeleteConfirmDialog
              open={deleteDialogOpen}
              onOpenChange={setDeleteDialogOpen}
              title="Delete Permission"
              description={`Are you sure you want to delete the ${selectedPermission.name} permission? This action cannot be undone and will affect ${selectedPermission.roleCount} role(s).`}
              onConfirm={async () => {
                await new Promise((resolve) => setTimeout(resolve, 1000))
              }}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
