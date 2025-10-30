"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, TrendingUp, Download, Calendar, Database } from "lucide-react"
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, LineChart, Line, Tooltip } from "recharts"
import { useState } from "react"

const soilData24h = [
  { time: "00:00", moisture: 65, ph: 6.8, npk: 82, nitrogen: 45, phosphorus: 20, potassium: 35 },
  { time: "04:00", moisture: 62, ph: 6.9, npk: 84, nitrogen: 46, phosphorus: 21, potassium: 36 },
  { time: "08:00", moisture: 68, ph: 6.7, npk: 86, nitrogen: 47, phosphorus: 22, potassium: 37 },
  { time: "12:00", moisture: 70, ph: 6.8, npk: 85, nitrogen: 48, phosphorus: 23, potassium: 38 },
  { time: "16:00", moisture: 66, ph: 6.9, npk: 87, nitrogen: 49, phosphorus: 24, potassium: 39 },
  { time: "20:00", moisture: 64, ph: 6.8, npk: 85, nitrogen: 50, phosphorus: 25, potassium: 40 },
]

const soilData7d = [
  { time: "Mon", moisture: 65, ph: 6.8, npk: 82, nitrogen: 45, phosphorus: 20, potassium: 35 },
  { time: "Tue", moisture: 67, ph: 6.7, npk: 84, nitrogen: 47, phosphorus: 22, potassium: 37 },
  { time: "Wed", moisture: 69, ph: 6.9, npk: 86, nitrogen: 49, phosphorus: 24, potassium: 39 },
  { time: "Thu", moisture: 71, ph: 6.8, npk: 88, nitrogen: 51, phosphorus: 26, potassium: 41 },
  { time: "Fri", moisture: 68, ph: 6.7, npk: 85, nitrogen: 48, phosphorus: 23, potassium: 38 },
  { time: "Sat", moisture: 66, ph: 6.9, npk: 87, nitrogen: 50, phosphorus: 25, potassium: 40 },
  { time: "Sun", moisture: 64, ph: 6.8, npk: 83, nitrogen: 46, phosphorus: 21, potassium: 36 },
]

const soilData30d = [
  { time: "Week 1", moisture: 65, ph: 6.8, npk: 82, nitrogen: 45, phosphorus: 20, potassium: 35 },
  { time: "Week 2", moisture: 68, ph: 6.7, npk: 85, nitrogen: 48, phosphorus: 23, potassium: 38 },
  { time: "Week 3", moisture: 70, ph: 6.9, npk: 87, nitrogen: 50, phosphorus: 25, potassium: 40 },
  { time: "Week 4", moisture: 67, ph: 6.8, npk: 84, nitrogen: 47, phosphorus: 22, potassium: 37 },
]

const aiRecommendations = [
  { date: "2024-01-15", recommendation: "Increase nitrogen fertilizer by 15%", status: "Applied", impact: "Positive" },
  {
    date: "2024-01-14",
    recommendation: "Reduce irrigation frequency to prevent overwatering",
    status: "Applied",
    impact: "Positive",
  },
  {
    date: "2024-01-13",
    recommendation: "Apply potassium supplement for better fruit development",
    status: "Pending",
    impact: "Expected",
  },
  {
    date: "2024-01-12",
    recommendation: "Monitor pH levels - trending towards acidic",
    status: "Monitoring",
    impact: "Neutral",
  },
]

export function ReportsCard() {
  const [timeFilter, setTimeFilter] = useState("24h")
  const [activeTab, setActiveTab] = useState("charts")

  const getCurrentData = () => {
    switch (timeFilter) {
      case "7d":
        return soilData7d
      case "30d":
        return soilData30d
      default:
        return soilData24h
    }
  }

  const handleExport = (format: string) => {
    const data = getCurrentData()
    if (format === "csv") {
      const csvContent = [Object.keys(data[0]).join(","), ...data.map((row) => Object.values(row).join(","))].join("\n")

      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `spark-soil-report-${timeFilter}.csv`
      a.click()
    } else if (format === "pdf") {
      // In a real implementation, you'd use a PDF library like jsPDF
      alert("PDF export functionality would be implemented with a PDF library")
    }
  }

  const currentData = getCurrentData()

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-accent" />
            </div>
            <span>Smart Farming Reports</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-32">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={handleExport}>
              <SelectTrigger className="w-32">
                <Download className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Export" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">Export CSV</SelectItem>
                <SelectItem value="pdf">Export PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="charts">Sensor Charts</TabsTrigger>
            <TabsTrigger value="npk">NPK Analysis</TabsTrigger>
            <TabsTrigger value="ai">AI Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="charts" className="space-y-6">
            {/* Chart Legend */}
            <div className="flex items-center justify-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">Moisture %</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">pH Level</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">Water Level %</span>
              </div>
            </div>

            {/* Line Chart for Moisture, pH, Water Level */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={currentData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="time" className="text-xs" tick={{ fontSize: 12 }} />
                  <YAxis className="text-xs" tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="moisture" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="ph" stroke="#10b981" strokeWidth={2} transform="scale(10)" />
                  <Line type="monotone" dataKey="npk" stroke="#8b5cf6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="npk" className="space-y-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="time" className="text-xs" tick={{ fontSize: 12 }} />
                  <YAxis className="text-xs" tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="nitrogen" fill="#ef4444" name="Nitrogen (N)" />
                  <Bar dataKey="phosphorus" fill="#f97316" name="Phosphorus (P)" />
                  <Bar dataKey="potassium" fill="#eab308" name="Potassium (K)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* NPK Status Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg text-center">
                <p className="text-lg font-bold text-red-600">47 mg/kg</p>
                <p className="text-xs text-muted-foreground">Nitrogen (N)</p>
                <Badge variant="destructive" className="text-xs mt-1">
                  Low
                </Badge>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg text-center">
                <p className="text-lg font-bold text-green-600">23 mg/kg</p>
                <p className="text-xs text-muted-foreground">Phosphorus (P)</p>
                <Badge variant="secondary" className="text-xs mt-1 bg-green-100 text-green-800">
                  Normal
                </Badge>
              </div>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg text-center">
                <p className="text-lg font-bold text-yellow-600">38 mg/kg</p>
                <p className="text-xs text-muted-foreground">Potassium (K)</p>
                <Badge variant="destructive" className="text-xs mt-1">
                  Low
                </Badge>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai" className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center space-x-2">
                <Database className="w-4 h-4" />
                <span>AI Recommendation History</span>
              </h4>
              {aiRecommendations.map((rec, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{rec.date}</span>
                    <Badge
                      variant={
                        rec.status === "Applied" ? "default" : rec.status === "Pending" ? "secondary" : "outline"
                      }
                    >
                      {rec.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{rec.recommendation}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">Impact:</span>
                    <Badge variant={rec.impact === "Positive" ? "default" : "secondary"} className="text-xs">
                      {rec.impact}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-muted/50 rounded-lg text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <Badge variant="secondary" className="text-xs">
                +2.3%
              </Badge>
            </div>
            <p className="text-lg font-bold text-foreground">68%</p>
            <p className="text-xs text-muted-foreground">Avg Moisture</p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <Badge variant="secondary" className="text-xs">
                Stable
              </Badge>
            </div>
            <p className="text-lg font-bold text-foreground">6.8</p>
            <p className="text-xs text-muted-foreground">Avg pH</p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-purple-500" />
              <Badge variant="secondary" className="text-xs">
                +1.8%
              </Badge>
            </div>
            <p className="text-lg font-bold text-foreground">85%</p>
            <p className="text-xs text-muted-foreground">Avg NPK</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
