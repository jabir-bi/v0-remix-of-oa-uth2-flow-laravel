"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AssignRolesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userName: string
  currentRoles: string[]
  onSuccess?: () => void
}

const availableRoles = [
  { id: "1", name: "Admin", description: "Full system access" },
  { id: "2", name: "Manager", description: "Can manage users and view reports" },
  { id: "3", name: "Editor", description: "Can edit content" },
  { id: "4", name: "Viewer", description: "Read-only access" },
]

export function AssignRolesDialog({ open, onOpenChange, userName, currentRoles, onSuccess }: AssignRolesDialogProps) {
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(false)
  const [selectedRoles, setSelectedRoles] = React.useState<string[]>(currentRoles)

  React.useEffect(() => {
    setSelectedRoles(currentRoles)
  }, [currentRoles])

  const handleToggle = (roleId: string) => {
    setSelectedRoles((prev) => (prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]))
  }

  const handleSubmit = async () => {
    setLoading(true)

    try {
      // API call would go here
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Roles updated",
        description: `Roles have been updated for ${userName}.`,
      })

      onSuccess?.()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update roles. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Roles</DialogTitle>
          <DialogDescription>Select roles to assign to {userName}.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[400px] pr-4">
          <div className="space-y-4">
            {availableRoles.map((role) => (
              <div key={role.id} className="flex items-start space-x-3 rounded-lg border p-4">
                <Checkbox
                  id={role.id}
                  checked={selectedRoles.includes(role.id)}
                  onCheckedChange={() => handleToggle(role.id)}
                />
                <div className="flex-1 space-y-1">
                  <Label htmlFor={role.id} className="cursor-pointer font-medium">
                    {role.name}
                  </Label>
                  <p className="text-sm text-muted-foreground">{role.description}</p>
                </div>
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
