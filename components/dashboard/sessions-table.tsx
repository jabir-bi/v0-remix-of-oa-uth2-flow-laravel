"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Monitor, Smartphone, Tablet, MapPin, Clock } from "lucide-react"

const sessions = [
  {
    id: "1",
    device: "Chrome on Windows",
    deviceType: "desktop",
    location: "San Francisco, CA",
    ip: "192.168.1.1",
    lastActive: "Active now",
    isCurrent: true,
  },
  {
    id: "2",
    device: "Safari on iPhone",
    deviceType: "mobile",
    location: "New York, NY",
    ip: "192.168.1.2",
    lastActive: "2 hours ago",
    isCurrent: false,
  },
  {
    id: "3",
    device: "Firefox on MacOS",
    deviceType: "desktop",
    location: "Los Angeles, CA",
    ip: "192.168.1.3",
    lastActive: "1 day ago",
    isCurrent: false,
  },
  {
    id: "4",
    device: "Chrome on Android",
    deviceType: "mobile",
    location: "Chicago, IL",
    ip: "192.168.1.4",
    lastActive: "3 days ago",
    isCurrent: false,
  },
]

export function SessionsTable() {
  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "mobile":
        return Smartphone
      case "tablet":
        return Tablet
      default:
        return Monitor
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Sessions</CardTitle>
        <CardDescription>Manage your active sessions across all devices</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {sessions.map((session) => {
          const DeviceIcon = getDeviceIcon(session.deviceType)
          return (
            <div key={session.id} className="flex items-start justify-between rounded-lg border border-border p-4">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <DeviceIcon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{session.device}</p>
                    {session.isCurrent && (
                      <Badge variant="default" className="bg-green-600">
                        Current
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {session.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {session.lastActive}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">IP: {session.ip}</p>
                </div>
              </div>
              {!session.isCurrent && (
                <Button variant="outline" size="sm">
                  Revoke
                </Button>
              )}
            </div>
          )
        })}
        <Button variant="destructive" className="w-full">
          Revoke All Other Sessions
        </Button>
      </CardContent>
    </Card>
  )
}
