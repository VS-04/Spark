"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Droplets, FlaskConical, Leaf, Ban as Tank, Plus, BarChart3, CheckCircle, AlertTriangle } from "lucide-react"

const initialMetrics = [
  {
    icon: Droplets,
    label: "Soil Moisture",
    value: 42,
    unit: "%",
    optimalRange: "40–60%",
    status: "normal",
    color: "text-blue-500",
    key: "moisture",
  },
  {
    icon: FlaskConical,
    label: "pH",
    value: 6.5,
    unit: "",
    optimalRange: "6.0–7.0",
    status: "normal",
    color: "text-green-500",
    key: "ph",
  },
  {
    icon: Leaf,
    label: "Nitrogen (N)",
    value: 45,
    unit: "mg/kg",
    optimalRange: "50–80 mg/kg",
    status: "low",
    color: "text-orange-500",
    key: "nitrogen",
  },
  {
    icon: Leaf,
    label: "Phosphorus (P)",
    value: 20,
    unit: "mg/kg",
    optimalRange: "20–40 mg/kg",
    status: "normal",
    color: "text-green-500",
    key: "phosphorus",
  },
  {
    icon: Leaf,
    label: "Potassium (K)",
    value: 35,
    unit: "mg/kg",
    optimalRange: "40–60 mg/kg",
    status: "low",
    color: "text-orange-500",
    key: "potassium",
  },
  {
    icon: Tank,
    label: "Water Level",
    value: 65,
    unit: "%",
    optimalRange: ">30%",
    status: "normal",
    color: "text-cyan-500",
    key: "water",
  },
]

function analyzeReading(key: string, value: number) {
  switch (key) {
    case "moisture":
      if (value < 40) return { status: "low", color: "text-red-500" }
      if (value > 60) return { status: "high", color: "text-orange-500" }
      return { status: "normal", color: "text-green-500" }
    case "ph":
      if (value < 6.0) return { status: "acidic", color: "text-red-500" }
      if (value > 7.0) return { status: "alkaline", color: "text-orange-500" }
      return { status: "normal", color: "text-green-500" }
    case "nitrogen":
      if (value < 50) return { status: "low", color: "text-orange-500" }
      if (value > 80) return { status: "high", color: "text-orange-500" }
      return { status: "normal", color: "text-green-500" }
    case "phosphorus":
      if (value < 20) return { status: "low", color: "text-orange-500" }
      if (value > 40) return { status: "high", color: "text-orange-500" }
      return { status: "normal", color: "text-green-500" }
    case "potassium":
      if (value < 40) return { status: "low", color: "text-orange-500" }
      if (value > 60) return { status: "high", color: "text-orange-500" }
      return { status: "normal", color: "text-green-500" }
    case "water":
      if (value < 30) return { status: "critical", color: "text-red-500" }
      return { status: "normal", color: "text-green-500" }
    default:
      return { status: "unknown", color: "text-gray-500" }
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "normal":
      return <CheckCircle className="w-4 h-4 text-green-500" />
    case "low":
    case "high":
    case "acidic":
    case "alkaline":
      return <AlertTriangle className="w-4 h-4 text-orange-500" />
    case "critical":
      return <AlertTriangle className="w-4 h-4 text-red-500" />
    default:
      return <CheckCircle className="w-4 h-4 text-gray-500" />
  }
}

export function SoilHealthCard() {
  const [metrics, setMetrics] = useState(initialMetrics)
  const [inputValues, setInputValues] = useState({
    moisture: "",
    ph: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    water: "",
  })
  const [analysis, setAnalysis] = useState<string>("")

  const handleInputChange = (key: string, value: string) => {
    setInputValues((prev) => ({ ...prev, [key]: value }))
  }

  const processReadings = () => {
    const newMetrics = metrics.map((metric) => {
      const inputValue = inputValues[metric.key as keyof typeof inputValues]
      if (inputValue && !isNaN(Number(inputValue))) {
        const numValue = Number(inputValue)
        const analysis = analyzeReading(metric.key, numValue)
        return {
          ...metric,
          value: numValue,
          status: analysis.status,
          color: analysis.color,
        }
      }
      return metric
    })

    setMetrics(newMetrics)

    const issues = newMetrics.filter((m) => {
      const inputValue = inputValues[m.key as keyof typeof inputValues]
      if (inputValue && !isNaN(Number(inputValue))) {
        const analysis = analyzeReading(m.key, Number(inputValue))
        return analysis.status !== "normal"
      }
      return false
    })

    if (issues.length > 0) {
      setAnalysis(
        `Analysis: ${issues.length} parameter(s) need attention. ${issues.map((i) => `${i.label} is ${i.status}`).join(", ")}. Consider adjusting fertilization and irrigation schedules.`,
      )
    } else {
      setAnalysis("Analysis: All parameters are within optimal ranges. Continue current management practices.")
    }

    setInputValues({ moisture: "", ph: "", nitrogen: "", phosphorus: "", potassium: "", water: "" })
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <FlaskConical className="w-4 h-4 text-primary" />
          </div>
          <span>Soil Health Overview</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="input" className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Readings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium text-foreground">Parameter</th>
                    <th className="text-center py-2 font-medium text-foreground">Current</th>
                    <th className="text-center py-2 font-medium text-foreground">Optimal Range</th>
                    <th className="text-center py-2 font-medium text-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.map((metric, index) => (
                    <tr key={metric.key} className={index % 2 === 0 ? "bg-muted/20" : ""}>
                      <td className="py-3 flex items-center space-x-2">
                        <metric.icon className={`w-4 h-4 ${metric.color}`} />
                        <span className="font-medium text-foreground">{metric.label}</span>
                      </td>
                      <td className="text-center py-3">
                        <span className="font-semibold text-foreground">
                          {metric.value}
                          {metric.unit}
                        </span>
                      </td>
                      <td className="text-center py-3 text-muted-foreground">{metric.optimalRange}</td>
                      <td className="text-center py-3">
                        <div className="flex items-center justify-center space-x-2">
                          {getStatusIcon(metric.status)}
                          <Badge
                            variant={metric.status === "normal" ? "default" : "secondary"}
                            className={`text-xs capitalize ${
                              metric.status === "normal"
                                ? "bg-green-100 text-green-800"
                                : metric.status === "critical"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-orange-100 text-orange-800"
                            }`}
                          >
                            {metric.status}
                          </Badge>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {analysis && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium text-foreground mb-2">Latest Analysis</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{analysis}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="input" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {metrics.map((metric) => (
                <div key={metric.key} className="space-y-2">
                  <Label htmlFor={metric.key} className="flex items-center space-x-2">
                    <metric.icon className={`w-4 h-4 ${metric.color}`} />
                    <span>{metric.label}</span>
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      id={metric.key}
                      type="number"
                      step={metric.key === "ph" ? "0.1" : "1"}
                      placeholder={`Enter ${metric.label.toLowerCase()}`}
                      value={inputValues[metric.key as keyof typeof inputValues]}
                      onChange={(e) => handleInputChange(metric.key, e.target.value)}
                      className="flex-1"
                    />
                    <span className="flex items-center text-sm text-muted-foreground px-2">{metric.unit}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Optimal: {metric.optimalRange}</p>
                </div>
              ))}
            </div>

            <Button onClick={processReadings} className="w-full">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analyze Readings
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
