import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Users, Shield, Activity, Database } from "lucide-react"

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
      title: "Active Sessions",
      value: "1,234",
      change: "+5.2%",
      icon: Activity,
      trend: "up",
    },
    {
      title: "Auth Requests",
      value: "45,231",
      change: "+18.3%",
      icon: Shield,
      trend: "up",
    },
    {
      title: "Database Queries",
      value: "892K",
      change: "-2.4%",
      icon: Database,
      trend: "down",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your OAuth2 authentication dashboard</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest authentication events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { user: "john@example.com", action: "Logged in", time: "2 minutes ago" },
                  { user: "sarah@example.com", action: "Token refreshed", time: "5 minutes ago" },
                  { user: "mike@example.com", action: "Logged out", time: "10 minutes ago" },
                  { user: "emma@example.com", action: "Logged in", time: "15 minutes ago" },
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

          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>OAuth2 service health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { service: "Authorization Server", status: "Operational", uptime: "99.9%" },
                  { service: "Token Endpoint", status: "Operational", uptime: "99.8%" },
                  { service: "User Info API", status: "Operational", uptime: "99.7%" },
                  { service: "Database", status: "Operational", uptime: "100%" },
                ].map((service, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="text-sm font-medium">{service.service}</p>
                      <p className="text-xs text-green-600">{service.status}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{service.uptime}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
