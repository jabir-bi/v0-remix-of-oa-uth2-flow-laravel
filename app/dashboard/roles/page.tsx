"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DataTable, type Column } from "@/components/access-control/data-table"
import { ActionMenu, type ActionMenuItem } from "@/components/access-control/action-menu"
import { AssignPermissionsDialog } from "@/components/access-control/assign-permissions-dialog"
import { DeleteConfirmDialog } from "@/components/access-control/delete-confirm-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Eye, Edit, Shield, Trash2, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Role } from "@/lib/api/roles"

const mockRoles: Role[] = [
  {
    id: "1",
    name: "Admin",
    description: "Full system access with all permissions",
    userCount: 5,
    permissionCount: 24,
    permissions: ["users.manage", "roles.manage", "permissions.manage"],
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    name: "Manager",
    description: "Can manage users and view reports",
    userCount: 12,
    permissionCount: 15,
    permissions: ["users.view", "users.edit", "roles.view"],
    createdAt: "2024-01-05",
  },
  {
    id: "3",
    name: "Editor",
    description: "Can edit content and manage resources",
    userCount: 45,
    permissionCount: 10,
    permissions: ["users.view", "users.edit"],
    createdAt: "2024-01-10",
  },
  {
    id: "4",
    name: "Viewer",
    description: "Read-only access to system resources",
    userCount: 234,
    permissionCount: 5,
    permissions: ["users.view"],
    createdAt: "2024-01-15",
  },
]

export default function RolesPage() {
  const { toast } = useToast()
  const [roles, setRoles] = React.useState<Role[]>(mockRoles)
  const [selectedRole, setSelectedRole] = React.useState<Role | undefined>()
  const [roleFormOpen, setRoleFormOpen] = React.useState(false)
  const [viewDialogOpen, setViewDialogOpen] = React.useState(false)
  const [assignPermissionsOpen, setAssignPermissionsOpen] = React.useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [formData, setFormData] = React.useState({ name: "", description: "" })
  const [loading, setLoading] = React.useState(false)

  const handleCreateRole = () => {
    setSelectedRole(undefined)
    setFormData({ name: "", description: "" })
    setRoleFormOpen(true)
  }

  const handleEditRole = (role: Role) => {
    setSelectedRole(role)
    setFormData({ name: role.name, description: role.description })
    setRoleFormOpen(true)
  }

  const handleViewRole = (role: Role) => {
    setSelectedRole(role)
    setViewDialogOpen(true)
  }

  const handleAssignPermissions = (role: Role) => {
    setSelectedRole(role)
    setAssignPermissionsOpen(true)
  }

  const handleDeleteRole = (role: Role) => {
    setSelectedRole(role)
    setDeleteDialogOpen(true)
  }

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: selectedRole ? "Role updated" : "Role created",
        description: selectedRole
          ? "The role has been updated successfully."
          : "The role has been created successfully.",
      })

      setRoleFormOpen(false)
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

  const columns: Column<Role>[] = [
    {
      header: "Role Name",
      accessor: (role) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">{role.name}</p>
            <p className="text-sm text-muted-foreground">{role.description}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Users",
      accessor: (role) => (
        <Badge variant="secondary" className="font-medium">
          {role.userCount} users
        </Badge>
      ),
    },
    {
      header: "Permissions",
      accessor: (role) => (
        <Badge variant="outline" className="font-medium">
          {role.permissionCount} permissions
        </Badge>
      ),
    },
    {
      header: "Actions",
      accessor: (role) => {
        const actions: ActionMenuItem[] = [
          {
            label: "View Details",
            icon: <Eye className="h-4 w-4" />,
            onClick: () => handleViewRole(role),
          },
          {
            label: "Edit Role",
            icon: <Edit className="h-4 w-4" />,
            onClick: () => handleEditRole(role),
          },
          {
            label: "Assign Permissions",
            icon: <Shield className="h-4 w-4" />,
            onClick: () => handleAssignPermissions(role),
          },
          {
            label: "Delete Role",
            icon: <Trash2 className="h-4 w-4" />,
            onClick: () => handleDeleteRole(role),
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
            <h1 className="text-3xl font-bold tracking-tight">Roles</h1>
            <p className="text-muted-foreground">Manage user roles and their permissions</p>
          </div>
          <Button onClick={handleCreateRole}>
            <Plus className="mr-2 h-4 w-4" />
            Add Role
          </Button>
        </div>

        <DataTable data={roles} columns={columns} searchPlaceholder="Search roles..." />

        <Dialog open={roleFormOpen} onOpenChange={setRoleFormOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{selectedRole ? "Edit Role" : "Create Role"}</DialogTitle>
              <DialogDescription>
                {selectedRole ? "Update the role information below." : "Add a new role to the system."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Role Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setRoleFormOpen(false)} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : selectedRole ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {selectedRole && (
          <>
            <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Role Details</DialogTitle>
                  <DialogDescription>View role information and assigned permissions.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground">Role Name</Label>
                    <p className="text-lg font-medium">{selectedRole.name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Description</Label>
                    <p>{selectedRole.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Users</Label>
                      <p className="text-lg font-medium">{selectedRole.userCount}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Permissions</Label>
                      <p className="text-lg font-medium">{selectedRole.permissionCount}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Assigned Permissions</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedRole.permissions.map((permission) => (
                        <Badge key={permission} variant="secondary">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <AssignPermissionsDialog
              open={assignPermissionsOpen}
              onOpenChange={setAssignPermissionsOpen}
              targetName={selectedRole.name}
              currentPermissions={selectedRole.permissions}
            />

            <DeleteConfirmDialog
              open={deleteDialogOpen}
              onOpenChange={setDeleteDialogOpen}
              title="Delete Role"
              description={`Are you sure you want to delete the ${selectedRole.name} role? This action cannot be undone and will affect ${selectedRole.userCount} users.`}
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
