"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Settings, Save, Bell, Database, Wifi } from "lucide-react"

export function SettingsCard() {
  const [settings, setSettings] = useState({
    farmName: "Green Valley Farm",
    location: "California, USA",
    notifications: true,
    autoIrrigation: false,
    dataSync: true,
    alertThreshold: "75",
  })

  const handleSave = () => {
    console.log("[v0] Settings saved:", settings)
    // Here you would typically save to a backend
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-500/10 rounded-lg flex items-center justify-center">
            <Settings className="w-4 h-4 text-gray-500" />
          </div>
          <span>System Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Farm Information */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Farm Information</h4>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="farmName">Farm Name</Label>
              <Input
                id="farmName"
                value={settings.farmName}
                onChange={(e) => setSettings((prev) => ({ ...prev, farmName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={settings.location}
                onChange={(e) => setSettings((prev) => ({ ...prev, location: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* System Preferences */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">System Preferences</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-blue-500" />
                <Label htmlFor="notifications">Push Notifications</Label>
              </div>
              <Switch
                id="notifications"
                checked={settings.notifications}
                onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, notifications: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Wifi className="w-4 h-4 text-green-500" />
                <Label htmlFor="dataSync">Auto Data Sync</Label>
              </div>
              <Switch
                id="dataSync"
                checked={settings.dataSync}
                onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, dataSync: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-purple-500" />
                <Label htmlFor="autoIrrigation">Auto Irrigation</Label>
              </div>
              <Switch
                id="autoIrrigation"
                checked={settings.autoIrrigation}
                onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, autoIrrigation: checked }))}
              />
            </div>
          </div>
        </div>

        {/* Alert Threshold */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Alert Thresholds</h4>
          <div className="space-y-2">
            <Label htmlFor="alertThreshold">Soil Moisture Alert (%)</Label>
            <Input
              id="alertThreshold"
              type="number"
              value={settings.alertThreshold}
              onChange={(e) => setSettings((prev) => ({ ...prev, alertThreshold: e.target.value }))}
            />
          </div>
        </div>

        <Button onClick={handleSave} className="w-full">
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </CardContent>
    </Card>
  )
}
