import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function RolesPage() {
  const roles = [
    {
      id: 1,
      name: "Admin",
      description: "Full system access with all permissions",
      userCount: 5,
      permissions: 24,
      color: "bg-red-500",
    },
    {
      id: 2,
      name: "Manager",
      description: "Can manage users and view reports",
      userCount: 12,
      permissions: 15,
      color: "bg-blue-500",
    },
    {
      id: 3,
      name: "Editor",
      description: "Can edit content and manage resources",
      userCount: 45,
      permissions: 10,
      color: "bg-green-500",
    },
    {
      id: 4,
      name: "Viewer",
      description: "Read-only access to system resources",
      userCount: 234,
      permissions: 5,
      color: "bg-gray-500",
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
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Role
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {roles.map((role) => (
            <Card key={role.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg ${role.color} flex items-center justify-center`}>
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle>{role.name}</CardTitle>
                      <CardDescription>{role.description}</CardDescription>
                    </div>
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
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{role.userCount} users</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{role.permissions} permissions</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
