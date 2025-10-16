import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function PermissionsPage() {
  const permissionGroups = [
    {
      category: "User Management",
      permissions: [
        { id: 1, name: "users.view", description: "View users list", roles: 4 },
        { id: 2, name: "users.create", description: "Create new users", roles: 2 },
        { id: 3, name: "users.edit", description: "Edit user details", roles: 2 },
        { id: 4, name: "users.delete", description: "Delete users", roles: 1 },
      ],
    },
    {
      category: "Role Management",
      permissions: [
        { id: 5, name: "roles.view", description: "View roles list", roles: 3 },
        { id: 6, name: "roles.create", description: "Create new roles", roles: 1 },
        { id: 7, name: "roles.edit", description: "Edit role details", roles: 1 },
        { id: 8, name: "roles.delete", description: "Delete roles", roles: 1 },
      ],
    },
    {
      category: "Permission Management",
      permissions: [
        { id: 9, name: "permissions.view", description: "View permissions list", roles: 2 },
        { id: 10, name: "permissions.assign", description: "Assign permissions to roles", roles: 1 },
      ],
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
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Permission
          </Button>
        </div>

        <div className="space-y-6">
          {permissionGroups.map((group) => (
            <Card key={group.category}>
              <CardHeader>
                <CardTitle>{group.category}</CardTitle>
                <CardDescription>{group.permissions.length} permissions in this category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {group.permissions.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-center justify-between rounded-lg border border-border p-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <code className="rounded bg-muted px-2 py-1 text-sm font-mono">{permission.name}</code>
                          <Badge variant="secondary">{permission.roles} roles</Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{permission.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
