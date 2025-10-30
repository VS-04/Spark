import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get("image") as File

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    const simulateCNNAnalysis = (filename: string) => {
      const diseases = [
        {
          name: "Healthy Plant",
          confidence: 94.2,
          category: "healthy",
          treatment: "Continue current care routine. Monitor regularly for any changes.",
          severity: "low",
          description: "Plant appears healthy with no visible signs of disease or stress.",
        },
        {
          name: "Early Blight (Alternaria solani)",
          confidence: 87.5,
          category: "fungal",
          treatment: "Apply copper-based fungicide. Remove affected leaves. Improve air circulation.",
          severity: "medium",
          description: "Fungal disease causing dark spots with concentric rings on leaves.",
        },
        {
          name: "Late Blight (Phytophthora infestans)",
          confidence: 91.3,
          category: "fungal",
          treatment: "Apply systemic fungicide immediately. Remove all affected plant material.",
          severity: "high",
          description: "Serious fungal disease that can destroy entire plants quickly.",
        },
        {
          name: "Nitrogen Deficiency",
          confidence: 83.7,
          category: "nutrient",
          treatment: "Apply nitrogen-rich fertilizer (10-5-5 NPK ratio). Monitor soil pH.",
          severity: "medium",
          description: "Yellowing of older leaves starting from leaf tips and edges.",
        },
        {
          name: "Potassium Deficiency",
          confidence: 79.4,
          category: "nutrient",
          treatment: "Apply potassium sulfate fertilizer. Ensure proper soil drainage.",
          severity: "medium",
          description: "Brown scorching along leaf edges, often with yellowing.",
        },
        {
          name: "Powdery Mildew",
          confidence: 88.9,
          category: "fungal",
          treatment: "Apply neem oil or sulfur-based fungicide. Reduce humidity around plants.",
          severity: "medium",
          description: "White powdery coating on leaves and stems.",
        },
        {
          name: "Bacterial Spot",
          confidence: 85.1,
          category: "bacterial",
          treatment: "Apply copper bactericide. Remove affected leaves. Avoid overhead watering.",
          severity: "high",
          description: "Small dark spots with yellow halos on leaves.",
        },
        {
          name: "Mosaic Virus",
          confidence: 92.6,
          category: "viral",
          treatment: "Remove infected plants immediately. Control aphid vectors. Use resistant varieties.",
          severity: "high",
          description: "Mottled yellow and green patterns on leaves with stunted growth.",
        },
      ]

      // Simulate CNN prediction based on filename or random selection
      const randomIndex = Math.floor(Math.random() * diseases.length)
      const primaryDisease = diseases[randomIndex]

      // Add some variation to confidence
      const confidence = Math.max(75, Math.min(95, primaryDisease.confidence + (Math.random() - 0.5) * 10))

      return {
        ...primaryDisease,
        confidence: Math.round(confidence * 10) / 10,
      }
    }

    const diagnosis = simulateCNNAnalysis(image.name)

    const result = {
      success: true,
      diagnosis: diagnosis.name,
      confidence: diagnosis.confidence,
      category: diagnosis.category,
      treatment: diagnosis.treatment,
      severity: diagnosis.severity,
      description: diagnosis.description,
      imageProcessed: true,
      timestamp: new Date().toISOString(),
      modelVersion: "PlantNet-CNN-v2.1",
      processingTime: Math.round(Math.random() * 2000 + 500), // Simulate processing time
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Plant diagnosis error:", error)
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 })
  }
}
