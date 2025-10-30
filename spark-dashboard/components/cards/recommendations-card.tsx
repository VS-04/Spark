import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, AlertTriangle, CheckCircle, Clock } from "lucide-react"

const recommendations = [
  {
    id: 1,
    type: "fertilizer",
    priority: "high",
    title: "Add Nitrogen Fertilizer",
    description: "Nitrogen levels are below optimal. Apply 20kg/hectare of urea fertilizer.",
    confidence: 94,
    icon: AlertTriangle,
    color: "text-orange-500",
  },
  {
    id: 2,
    type: "irrigation",
    priority: "medium",
    title: "Increase Irrigation",
    description: "Soil moisture in sector B is declining. Increase watering by 15%.",
    confidence: 87,
    icon: CheckCircle,
    color: "text-blue-500",
  },
  {
    id: 3,
    type: "monitoring",
    priority: "low",
    title: "Monitor pH Levels",
    description: "pH trending slightly acidic. Continue monitoring for next 48 hours.",
    confidence: 76,
    icon: Clock,
    color: "text-green-500",
  },
]

export function RecommendationsCard() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
            <Brain className="w-4 h-4 text-secondary" />
          </div>
          <span>AI Recommendations</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec) => (
          <div key={rec.id} className="p-4 border border-border rounded-lg space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <rec.icon className={`w-4 h-4 ${rec.color}`} />
                <span className="font-medium text-foreground">{rec.title}</span>
              </div>
              <Badge
                variant={rec.priority === "high" ? "destructive" : rec.priority === "medium" ? "default" : "secondary"}
                className="text-xs"
              >
                {rec.priority}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{rec.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Confidence: {rec.confidence}%</span>
              <Button size="sm" variant="outline" className="text-xs bg-transparent">
                Apply
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
