"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DataTable, type Column } from "@/components/access-control/data-table"
import { ActionMenu, type ActionMenuItem } from "@/components/access-control/action-menu"
import { UserFormDialog } from "@/components/access-control/user-form-dialog"
import { AssignRolesDialog } from "@/components/access-control/assign-roles-dialog"
import { AssignPermissionsDialog } from "@/components/access-control/assign-permissions-dialog"
import { DeleteConfirmDialog } from "@/components/access-control/delete-confirm-dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { UserPlus, Eye, Edit, Shield, UserCog, Trash2 } from "lucide-react"
import type { User } from "@/lib/api/users"

const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "active",
    lastLogin: "2 hours ago",
    permissions: ["users.manage", "roles.manage", "permissions.manage"],
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Sarah Smith",
    email: "sarah@example.com",
    role: "Manager",
    status: "active",
    lastLogin: "5 hours ago",
    permissions: ["users.view", "users.edit"],
    createdAt: "2024-01-20",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    role: "Editor",
    status: "inactive",
    lastLogin: "2 days ago",
    permissions: ["users.view"],
    createdAt: "2024-02-01",
  },
  {
    id: "4",
    name: "Emma Wilson",
    email: "emma@example.com",
    role: "Editor",
    status: "active",
    lastLogin: "1 hour ago",
    permissions: ["users.view", "users.edit"],
    createdAt: "2024-02-10",
  },
  {
    id: "5",
    name: "David Brown",
    email: "david@example.com",
    role: "Viewer",
    status: "active",
    lastLogin: "30 minutes ago",
    permissions: ["users.view"],
    createdAt: "2024-02-15",
  },
]

export default function UsersPage() {
  const [users, setUsers] = React.useState<User[]>(mockUsers)
  const [selectedUser, setSelectedUser] = React.useState<User | undefined>()
  const [userFormOpen, setUserFormOpen] = React.useState(false)
  const [assignRolesOpen, setAssignRolesOpen] = React.useState(false)
  const [assignPermissionsOpen, setAssignPermissionsOpen] = React.useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [viewDialogOpen, setViewDialogOpen] = React.useState(false)

  const handleCreateUser = () => {
    setSelectedUser(undefined)
    setUserFormOpen(true)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setUserFormOpen(true)
  }

  const handleViewUser = (user: User) => {
    setSelectedUser(user)
    setViewDialogOpen(true)
  }

  const handleAssignRoles = (user: User) => {
    setSelectedUser(user)
    setAssignRolesOpen(true)
  }

  const handleAssignPermissions = (user: User) => {
    setSelectedUser(user)
    setAssignPermissionsOpen(true)
  }

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user)
    setDeleteDialogOpen(true)
  }

  const columns: Column<User>[] = [
    {
      header: "User",
      accessor: (user) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.avatar || "/placeholder.svg"} />
            <AvatarFallback className="bg-primary/10 text-primary">{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Role",
      accessor: (user) => (
        <Badge variant={user.role === "Admin" ? "default" : "secondary"} className="font-medium">
          {user.role}
        </Badge>
      ),
    },
    {
      header: "Status",
      accessor: (user) => (
        <Badge
          variant={user.status === "active" ? "default" : "secondary"}
          className={user.status === "active" ? "bg-green-600 hover:bg-green-700" : ""}
        >
          {user.status}
        </Badge>
      ),
    },
    {
      header: "Last Login",
      accessor: (user) => <span className="text-sm text-muted-foreground">{user.lastLogin}</span>,
    },
    {
      header: "Permissions",
      accessor: (user) => (
        <div className="flex flex-wrap gap-1">
          {user.permissions.slice(0, 2).map((permission) => (
            <Badge key={permission} variant="outline" className="text-xs">
              {permission}
            </Badge>
          ))}
          {user.permissions.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{user.permissions.length - 2}
            </Badge>
          )}
        </div>
      ),
    },
    {
      header: "Actions",
      accessor: (user) => {
        const actions: ActionMenuItem[] = [
          {
            label: "View Profile",
            icon: <Eye className="h-4 w-4" />,
            onClick: () => handleViewUser(user),
          },
          {
            label: "Edit User",
            icon: <Edit className="h-4 w-4" />,
            onClick: () => handleEditUser(user),
          },
          {
            label: "Assign Roles",
            icon: <UserCog className="h-4 w-4" />,
            onClick: () => handleAssignRoles(user),
          },
          {
            label: "Assign Permissions",
            icon: <Shield className="h-4 w-4" />,
            onClick: () => handleAssignPermissions(user),
          },
          {
            label: "Delete User",
            icon: <Trash2 className="h-4 w-4" />,
            onClick: () => handleDeleteUser(user),
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
            <h1 className="text-3xl font-bold tracking-tight">Users</h1>
            <p className="text-muted-foreground">Manage user accounts and permissions</p>
          </div>
          <Button onClick={handleCreateUser}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>

        <DataTable data={users} columns={columns} searchPlaceholder="Search users..." />

        <UserFormDialog open={userFormOpen} onOpenChange={setUserFormOpen} user={selectedUser} />

        {selectedUser && (
          <>
            <AssignRolesDialog
              open={assignRolesOpen}
              onOpenChange={setAssignRolesOpen}
              userName={selectedUser.name}
              currentRoles={[selectedUser.role]}
            />

            <AssignPermissionsDialog
              open={assignPermissionsOpen}
              onOpenChange={setAssignPermissionsOpen}
              targetName={selectedUser.name}
              currentPermissions={selectedUser.permissions}
            />

            <DeleteConfirmDialog
              open={deleteDialogOpen}
              onOpenChange={setDeleteDialogOpen}
              title="Delete User"
              description={`Are you sure you want to delete ${selectedUser.name}? This action cannot be undone.`}
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
