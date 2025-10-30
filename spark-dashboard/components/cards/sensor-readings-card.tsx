"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Scissors as Sensors,
  Thermometer,
  Droplets,
  Wind,
  Sun,
  Activity,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react"

interface Reading {
  id: string
  timestamp: string
  temperature: number
  humidity: number
  windSpeed: number
  lightIntensity: number
  soilTemp: number
  analysis: string
}

export function SensorReadingsCard() {
  const [readings, setReadings] = useState<Reading[]>([
    {
      id: "1",
      timestamp: new Date().toLocaleString(),
      temperature: 24.5,
      humidity: 65,
      windSpeed: 12,
      lightIntensity: 850,
      soilTemp: 22.1,
      analysis: "Optimal growing conditions detected. Temperature and humidity levels are ideal for crop development.",
    },
  ])

  const [inputData, setInputData] = useState({
    temperature: "",
    humidity: "",
    windSpeed: "",
    lightIntensity: "",
    soilTemp: "",
  })

  const [isProcessing, setIsProcessing] = useState(false)

  const generateAnalysis = (data: typeof inputData) => {
    const temp = Number(data.temperature)
    const humidity = Number(data.humidity)
    const wind = Number(data.windSpeed)
    const light = Number(data.lightIntensity)
    const soilTemp = Number(data.soilTemp)

    let analysis = "🌱 Environmental Analysis: "
    const issues = []
    const positives = []
    const warnings = []

    // Temperature analysis
    if (temp < 15) issues.push("Temperature too low for optimal growth")
    else if (temp > 35) issues.push("Temperature stress risk - consider cooling")
    else if (temp < 18 || temp > 30) warnings.push("Temperature approaching stress levels")
    else positives.push("Temperature within optimal range")

    // Humidity analysis
    if (humidity < 40) issues.push("Low humidity may cause plant stress")
    else if (humidity > 80) issues.push("High humidity increases disease risk")
    else if (humidity < 50 || humidity > 70) warnings.push("Humidity levels need monitoring")
    else positives.push("Humidity levels are appropriate")

    // Wind analysis
    if (wind > 25) issues.push("Strong winds may damage crops")
    else if (wind < 5) issues.push("Poor air circulation")
    else positives.push("Good air circulation")

    // Light analysis
    if (light < 400) issues.push("Insufficient light for photosynthesis")
    else if (light > 1200) issues.push("Excessive light may cause heat stress")
    else if (light < 600 || light > 1000) warnings.push("Light levels could be optimized")
    else positives.push("Light levels are adequate")

    // Soil temperature analysis
    if (Math.abs(soilTemp - temp) > 5) warnings.push("Large temperature difference between air and soil")

    if (issues.length > 0) {
      analysis += "⚠️ CRITICAL: " + issues.join(". ") + ". "
    }
    if (warnings.length > 0) {
      analysis += "⚡ MONITOR: " + warnings.join(". ") + ". "
    }
    if (positives.length > 0) {
      analysis += "✅ GOOD: " + positives.join(". ") + "."
    }

    return analysis
  }

  const handleSubmit = async () => {
    if (Object.values(inputData).some((val) => val === "")) {
      return
    }

    setIsProcessing(true)

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const analysis = generateAnalysis(inputData)

    const newReading: Reading = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(),
      temperature: Number(inputData.temperature),
      humidity: Number(inputData.humidity),
      windSpeed: Number(inputData.windSpeed),
      lightIntensity: Number(inputData.lightIntensity),
      soilTemp: Number(inputData.soilTemp),
      analysis,
    }

    setReadings((prev) => [newReading, ...prev.slice(0, 2)])
    setInputData({
      temperature: "",
      humidity: "",
      windSpeed: "",
      lightIntensity: "",
      soilTemp: "",
    })

    setIsProcessing(false)
  }

  const getStatusIcon = (value: number, type: string) => {
    switch (type) {
      case "temperature":
        if (value < 15 || value > 35) return <XCircle className="w-3 h-3 text-red-500" />
        if (value < 18 || value > 30) return <AlertTriangle className="w-3 h-3 text-orange-500" />
        return <CheckCircle className="w-3 h-3 text-green-500" />
      case "humidity":
        if (value < 40 || value > 80) return <XCircle className="w-3 h-3 text-red-500" />
        if (value < 50 || value > 70) return <AlertTriangle className="w-3 h-3 text-orange-500" />
        return <CheckCircle className="w-3 h-3 text-green-500" />
      default:
        return <CheckCircle className="w-3 h-3 text-green-500" />
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <Sensors className="w-4 h-4 text-blue-500" />
          </div>
          <span>Environmental Readings</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Section */}
        <div className="p-4 border border-border rounded-lg space-y-4">
          <h4 className="font-medium text-foreground flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>Add New Reading</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="temperature" className="flex items-center space-x-2">
                <Thermometer className="w-4 h-4 text-red-500" />
                <span>Temperature</span>
              </Label>
              <div className="flex space-x-2">
                <Input
                  id="temperature"
                  type="number"
                  placeholder="24.5"
                  value={inputData.temperature}
                  onChange={(e) => setInputData((prev) => ({ ...prev, temperature: e.target.value }))}
                  className="flex-1"
                />
                <span className="flex items-center text-sm text-muted-foreground px-2">°C</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="humidity" className="flex items-center space-x-2">
                <Droplets className="w-4 h-4 text-blue-500" />
                <span>Humidity</span>
              </Label>
              <div className="flex space-x-2">
                <Input
                  id="humidity"
                  type="number"
                  placeholder="65"
                  value={inputData.humidity}
                  onChange={(e) => setInputData((prev) => ({ ...prev, humidity: e.target.value }))}
                  className="flex-1"
                />
                <span className="flex items-center text-sm text-muted-foreground px-2">%</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="windSpeed" className="flex items-center space-x-2">
                <Wind className="w-4 h-4 text-gray-500" />
                <span>Wind Speed</span>
              </Label>
              <div className="flex space-x-2">
                <Input
                  id="windSpeed"
                  type="number"
                  placeholder="12"
                  value={inputData.windSpeed}
                  onChange={(e) => setInputData((prev) => ({ ...prev, windSpeed: e.target.value }))}
                  className="flex-1"
                />
                <span className="flex items-center text-sm text-muted-foreground px-2">km/h</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lightIntensity" className="flex items-center space-x-2">
                <Sun className="w-4 h-4 text-yellow-500" />
                <span>Light Intensity</span>
              </Label>
              <div className="flex space-x-2">
                <Input
                  id="lightIntensity"
                  type="number"
                  placeholder="850"
                  value={inputData.lightIntensity}
                  onChange={(e) => setInputData((prev) => ({ ...prev, lightIntensity: e.target.value }))}
                  className="flex-1"
                />
                <span className="flex items-center text-sm text-muted-foreground px-2">lux</span>
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="soilTemp" className="flex items-center space-x-2">
                <Thermometer className="w-4 h-4 text-orange-500" />
                <span>Soil Temperature</span>
              </Label>
              <div className="flex space-x-2">
                <Input
                  id="soilTemp"
                  type="number"
                  placeholder="22.1"
                  value={inputData.soilTemp}
                  onChange={(e) => setInputData((prev) => ({ ...prev, soilTemp: e.target.value }))}
                  className="flex-1"
                />
                <span className="flex items-center text-sm text-muted-foreground px-2">°C</span>
              </div>
            </div>
          </div>

          <Button onClick={handleSubmit} className="w-full" disabled={isProcessing}>
            <Activity className={`w-4 h-4 mr-2 ${isProcessing ? "animate-spin" : ""}`} />
            {isProcessing ? "Analyzing Environment..." : "Analyze Environment"}
          </Button>
        </div>

        {/* Recent Readings */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Recent Analysis Results</h4>
          {readings.map((reading) => (
            <div key={reading.id} className="p-4 bg-muted/50 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Analysis #{reading.id}</span>
                <Badge variant="secondary" className="text-xs">
                  {reading.timestamp}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(reading.temperature, "temperature")}
                  <span>{reading.temperature}°C</span>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(reading.humidity, "humidity")}
                  <span>{reading.humidity}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Wind className="w-3 h-3 text-gray-500" />
                  <span>{reading.windSpeed} km/h</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sun className="w-3 h-3 text-yellow-500" />
                  <span>{reading.lightIntensity} lux</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Thermometer className="w-3 h-3 text-orange-500" />
                  <span>{reading.soilTemp}°C soil</span>
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground leading-relaxed">{reading.analysis}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
