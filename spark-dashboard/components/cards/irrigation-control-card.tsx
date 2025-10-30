"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Droplets, Power, Settings, Activity } from "lucide-react"

export function IrrigationControlCard() {
  const [autoMode, setAutoMode] = useState(true)
  const [pumpStatus, setPumpStatus] = useState(true)

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Droplets className="w-4 h-4 text-primary" />
          </div>
          <span>Irrigation Control</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mode Toggle */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Settings className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">{autoMode ? "Auto Mode" : "Manual Mode"}</p>
              <p className="text-xs text-muted-foreground">
                {autoMode ? "AI-controlled irrigation" : "Manual pump control"}
              </p>
            </div>
          </div>
          <Switch checked={autoMode} onCheckedChange={setAutoMode} />
        </div>

        {/* Pump Status */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Power className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Pump Status</span>
            </div>
            <Badge variant={pumpStatus ? "default" : "secondary"} className="flex items-center space-x-1">
              <div
                className={`w-2 h-2 rounded-full ${pumpStatus ? "bg-green-500 animate-pulse-green" : "bg-gray-400"}`}
              />
              <span>{pumpStatus ? "Running" : "Stopped"}</span>
            </Badge>
          </div>

          {/* Control Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={pumpStatus ? "destructive" : "default"}
              size="sm"
              onClick={() => setPumpStatus(!pumpStatus)}
              disabled={autoMode}
              className="flex items-center space-x-2"
            >
              <Power className="w-4 h-4" />
              <span>{pumpStatus ? "Stop" : "Start"}</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent">
              <Activity className="w-4 h-4" />
              <span>Schedule</span>
            </Button>
          </div>
        </div>

        {/* Current Status */}
        <div className="p-3 border border-border rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-foreground">2.4L/min</p>
              <p className="text-xs text-muted-foreground">Flow Rate</p>
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">45min</p>
              <p className="text-xs text-muted-foreground">Runtime Today</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
