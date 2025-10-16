"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface AssignPermissionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  targetName: string
  currentPermissions: string[]
  onSuccess?: () => void
}

const availablePermissions = [
  { id: "1", name: "users.view", description: "View users", category: "Users" },
  { id: "2", name: "users.create", description: "Create users", category: "Users" },
  { id: "3", name: "users.edit", description: "Edit users", category: "Users" },
  { id: "4", name: "users.delete", description: "Delete users", category: "Users" },
  { id: "5", name: "roles.view", description: "View roles", category: "Roles" },
  { id: "6", name: "roles.create", description: "Create roles", category: "Roles" },
  { id: "7", name: "roles.edit", description: "Edit roles", category: "Roles" },
  { id: "8", name: "roles.delete", description: "Delete roles", category: "Roles" },
  { id: "9", name: "permissions.view", description: "View permissions", category: "Permissions" },
  { id: "10", name: "permissions.manage", description: "Manage permissions", category: "Permissions" },
]

export function AssignPermissionsDialog({
  open,
  onOpenChange,
  targetName,
  currentPermissions,
  onSuccess,
}: AssignPermissionsDialogProps) {
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(false)
  const [selectedPermissions, setSelectedPermissions] = React.useState<string[]>(currentPermissions)

  React.useEffect(() => {
    setSelectedPermissions(currentPermissions)
  }, [currentPermissions])

  const handleToggle = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId) ? prev.filter((id) => id !== permissionId) : [...prev, permissionId],
    )
  }

  const groupedPermissions = availablePermissions.reduce(
    (acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = []
      }
      acc[permission.category].push(permission)
      return acc
    },
    {} as Record<string, typeof availablePermissions>,
  )

  const handleSubmit = async () => {
    setLoading(true)

    try {
      // API call would go here
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Permissions updated",
        description: `Permissions have been updated for ${targetName}.`,
      })

      onSuccess?.()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update permissions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Permissions</DialogTitle>
          <DialogDescription>Select permissions to assign to {targetName}.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[500px] pr-4">
          <div className="space-y-6">
            {Object.entries(groupedPermissions).map(([category, permissions]) => (
              <div key={category} className="space-y-3">
                <Badge variant="outline" className="mb-2">
                  {category}
                </Badge>
                {permissions.map((permission) => (
                  <div key={permission.id} className="flex items-start space-x-3 rounded-lg border p-3">
                    <Checkbox
                      id={permission.id}
                      checked={selectedPermissions.includes(permission.id)}
                      onCheckedChange={() => handleToggle(permission.id)}
                    />
                    <div className="flex-1 space-y-1">
                      <Label htmlFor={permission.id} className="cursor-pointer font-medium">
                        {permission.name}
                      </Label>
                      <p className="text-sm text-muted-foreground">{permission.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
