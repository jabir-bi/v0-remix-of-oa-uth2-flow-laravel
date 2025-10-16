import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Users, UserCog, Key } from "lucide-react"

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Users",
      value: "2,543",
      change: "+12.5%",
      icon: Users,
      trend: "up",
    },
    {
      title: "Active Roles",
      value: "8",
      change: "+2",
      icon: UserCog,
      trend: "up",
    },
    {
      title: "Permissions",
      value: "24",
      change: "+3",
      icon: Key,
      trend: "up",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Access control and user management overview</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent User Activity</CardTitle>
            <CardDescription>Latest user management events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { user: "john@example.com", action: "User created", time: "2 minutes ago" },
                { user: "sarah@example.com", action: "Role updated to Admin", time: "5 minutes ago" },
                { user: "mike@example.com", action: "Permissions modified", time: "10 minutes ago" },
                { user: "emma@example.com", action: "User logged in", time: "15 minutes ago" },
              ].map((activity, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="text-sm font-medium">{activity.user}</p>
                    <p className="text-xs text-muted-foreground">{activity.action}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
