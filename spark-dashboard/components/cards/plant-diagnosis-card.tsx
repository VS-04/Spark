"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Upload, Camera, AlertCircle, FileText, Microscope, Brain, Clock, CheckCircle } from "lucide-react"

interface DiagnosisResult {
  id: string
  timestamp: string
  symptoms?: string
  imageUploaded: boolean
  diagnosis: string
  confidence: number
  treatment: string
  severity: "low" | "medium" | "high"
  category?: string
  description?: string
  modelVersion?: string
  processingTime?: number
}

export function PlantDiagnosisCard() {
  const [diagnoses, setDiagnoses] = useState<DiagnosisResult[]>([
    {
      id: "1",
      timestamp: new Date().toLocaleString(),
      symptoms: "Yellow spots on leaves, wilting",
      imageUploaded: true,
      diagnosis: "Early Blight (Alternaria solani)",
      confidence: 91.2,
      treatment: "Apply copper-based fungicide within 24 hours. Remove affected leaves.",
      severity: "medium",
      category: "fungal",
      description: "Fungal disease causing dark spots with concentric rings on leaves.",
      modelVersion: "PlantNet-CNN-v2.1",
    },
  ])

  const [inputData, setInputData] = useState({
    symptoms: "",
    additionalNotes: "",
  })

  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const generateDiagnosis = (symptoms: string, notes: string) => {
    const symptomsLower = symptoms.toLowerCase()
    const notesLower = notes.toLowerCase()

    if (symptomsLower.includes("yellow") && symptomsLower.includes("spot")) {
      return {
        diagnosis: "Possible Leaf Spot Disease",
        confidence: 85,
        treatment: "Apply fungicide spray. Improve air circulation. Remove affected leaves.",
        severity: "medium" as const,
        category: "fungal",
        description: "Fungal infection causing yellow spots on leaf surfaces.",
      }
    } else if (symptomsLower.includes("wilt") || symptomsLower.includes("droop")) {
      return {
        diagnosis: "Water Stress or Root Issues",
        confidence: 78,
        treatment: "Check soil moisture and drainage. Inspect roots for rot. Adjust watering schedule.",
        severity: "high" as const,
        category: "environmental",
        description: "Plant showing signs of water stress or root system problems.",
      }
    } else if (symptomsLower.includes("brown") && symptomsLower.includes("edge")) {
      return {
        diagnosis: "Nutrient Deficiency (Potassium)",
        confidence: 82,
        treatment: "Apply potassium-rich fertilizer. Monitor soil pH levels.",
        severity: "low" as const,
        category: "nutrient",
        description: "Potassium deficiency causing brown leaf edges.",
      }
    } else if (symptomsLower.includes("curl") || symptomsLower.includes("twist")) {
      return {
        diagnosis: "Possible Viral Infection",
        confidence: 73,
        treatment: "Isolate affected plants. Remove infected material. Monitor for spread.",
        severity: "high" as const,
        category: "viral",
        description: "Viral infection causing leaf deformation.",
      }
    } else {
      return {
        diagnosis: "General Plant Stress",
        confidence: 65,
        treatment: "Monitor environmental conditions. Ensure proper watering and nutrition.",
        severity: "low" as const,
        category: "environmental",
        description: "Plant showing general signs of stress.",
      }
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const processImageWithCNN = async () => {
    if (!uploadedImage) return

    setIsProcessing(true)

    try {
      const formData = new FormData()
      formData.append("image", uploadedImage)

      const response = await fetch("/api/plant-diagnosis", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        const newDiagnosis: DiagnosisResult = {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleString(),
          imageUploaded: true,
          diagnosis: result.diagnosis,
          confidence: result.confidence,
          treatment: result.treatment,
          severity: result.severity,
          category: result.category,
          description: result.description,
          modelVersion: result.modelVersion,
          processingTime: result.processingTime,
        }

        setDiagnoses((prev) => [newDiagnosis, ...prev.slice(0, 2)])
        setUploadedImage(null)
        setImagePreview(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      }
    } catch (error) {
      console.error("Error processing image:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const processDiagnosis = () => {
    if (!inputData.symptoms.trim()) return

    const result = generateDiagnosis(inputData.symptoms, inputData.additionalNotes)

    const newDiagnosis: DiagnosisResult = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(),
      symptoms: inputData.symptoms,
      imageUploaded: false,
      diagnosis: result.diagnosis,
      confidence: result.confidence,
      treatment: result.treatment,
      severity: result.severity,
      category: result.category,
      description: result.description,
    }

    setDiagnoses((prev) => [newDiagnosis, ...prev.slice(0, 2)])
    setInputData({ symptoms: "", additionalNotes: "" })
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-orange-500"
      case "low":
        return "text-green-500"
      default:
        return "text-gray-500"
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case "fungal":
        return "🍄"
      case "bacterial":
        return "🦠"
      case "viral":
        return "🧬"
      case "nutrient":
        return "🧪"
      case "environmental":
        return "🌡️"
      default:
        return "🔬"
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
            <Brain className="w-4 h-4 text-accent" />
          </div>
          <span>AI Plant Diagnosis</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="image" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="image" className="flex items-center space-x-2">
              <Camera className="w-4 h-4" />
              <span>CNN Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="symptoms" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Symptom Analysis</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="image" className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center space-y-4">
              {imagePreview ? (
                <div className="space-y-4">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Plant preview"
                    className="max-w-full h-32 object-cover rounded-lg mx-auto"
                  />
                  <div className="flex items-center justify-center space-x-2">
                    <Button
                      onClick={processImageWithCNN}
                      disabled={isProcessing}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isProcessing ? (
                        <>
                          <Brain className="w-4 h-4 mr-2 animate-spin" />
                          Processing with CNN...
                        </>
                      ) : (
                        <>
                          <Brain className="w-4 h-4 mr-2" />
                          Analyze with AI
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setImagePreview(null)
                        setUploadedImage(null)
                        if (fileInputRef.current) fileInputRef.current.value = ""
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                  {isProcessing && (
                    <div className="space-y-2">
                      <Progress value={33} className="w-full" />
                      <p className="text-xs text-muted-foreground">CNN model analyzing plant features...</p>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto">
                    <Upload className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Upload Plant Image for CNN Analysis</p>
                    <p className="text-xs text-muted-foreground">
                      AI will analyze leaf patterns, spots, and disease symptoms
                    </p>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </Button>
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="symptoms" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="symptoms" className="flex items-center space-x-2">
                  <Microscope className="w-4 h-4 text-blue-500" />
                  <span>Describe Symptoms</span>
                </Label>
                <Textarea
                  id="symptoms"
                  placeholder="Describe what you observe: leaf color changes, wilting, spots, etc."
                  value={inputData.symptoms}
                  onChange={(e) => setInputData((prev) => ({ ...prev, symptoms: e.target.value }))}
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Environmental conditions, recent changes, treatment history..."
                  value={inputData.additionalNotes}
                  onChange={(e) => setInputData((prev) => ({ ...prev, additionalNotes: e.target.value }))}
                  className="min-h-[60px]"
                />
              </div>

              <Button onClick={processDiagnosis} className="w-full" disabled={!inputData.symptoms.trim()}>
                <Microscope className="w-4 h-4 mr-2" />
                Analyze Symptoms
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="space-y-4">
          <h4 className="font-medium text-foreground flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>AI Diagnosis Results</span>
          </h4>
          {diagnoses.map((result) => (
            <div key={result.id} className="p-4 bg-muted/50 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getCategoryIcon(result.category)}</span>
                  <AlertCircle className={`w-4 h-4 ${getSeverityColor(result.severity)}`} />
                  <span className="font-medium text-foreground">{result.diagnosis}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getSeverityBadge(result.severity)} className="text-xs">
                    {result.severity}
                  </Badge>
                  {result.imageUploaded && (
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                      <Brain className="w-3 h-3 mr-1" />
                      CNN
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                {result.description && (
                  <p className="text-sm text-muted-foreground">
                    <strong>Description:</strong> {result.description}
                  </p>
                )}
                {result.symptoms && (
                  <p className="text-sm text-muted-foreground">
                    <strong>Symptoms:</strong> {result.symptoms}
                  </p>
                )}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong>Treatment:</strong> {result.treatment}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center space-x-4">
                  <span className="text-xs text-muted-foreground">Confidence: {result.confidence}%</span>
                  {result.modelVersion && (
                    <span className="text-xs text-muted-foreground">Model: {result.modelVersion}</span>
                  )}
                  {result.processingTime && (
                    <span className="text-xs text-muted-foreground flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{result.processingTime}ms</span>
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{result.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
