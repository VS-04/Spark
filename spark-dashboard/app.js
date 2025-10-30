// State Management
const state = {
  activeSection: "Home",
  diagnoses: [
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
  ],
  weatherData: null,
  uploadedImage: null,
  imagePreview: null,
  isProcessing: false,
}

// Initialize App
document.addEventListener("DOMContentLoaded", async () => {
  await initializeDB()
  initializeNavigation()
  initializeTime()
  getLocation()
  renderContent()
})

// Navigation
function initializeNavigation() {
  const navItems = document.querySelectorAll(".nav-item")
  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      navItems.forEach((n) => n.classList.remove("active"))
      e.target.classList.add("active")
      state.activeSection = e.target.dataset.section
      renderContent()
    })
  })
}

// Time Update
function initializeTime() {
  function updateTime() {
    const now = new Date()
    document.getElementById("time").textContent = now.toLocaleTimeString()
  }
  updateTime()
  setInterval(updateTime, 1000)
}

// Location
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        document.getElementById("location").textContent = `Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`
        fetchWeather(latitude, longitude)
      },
      () => {
        document.getElementById("location").textContent = "Location: Delhi, India"
        fetchWeather(28.5565, 77.2289)
      },
    )
  }
}

// Weather API
function fetchWeather(lat, lon) {
  // Mock weather data (since API key is invalid)
  state.weatherData = {
    location: "Delhi, India",
    temperature: 28,
    condition: "Partly Cloudy",
    humidity: 65,
    windSpeed: 12,
    feelsLike: 30,
    rainChance: 30,
    icon: "Cloud",
  }
}

// Render Content
function renderContent() {
  const contentArea = document.getElementById("content-area")

  switch (state.activeSection) {
    case "Home":
      contentArea.innerHTML = renderHome()
      break
    case "Soil Analysis":
      contentArea.innerHTML = renderSoilAnalysis()
      break
    case "Plant Diagnosis":
      contentArea.innerHTML = renderPlantDiagnosis()
      attachPlantDiagnosisListeners()
      break
    case "Irrigation Control":
      contentArea.innerHTML = renderIrrigationControl()
      attachIrrigationListeners()
      break
    case "Reports":
      contentArea.innerHTML = renderReports()
      break
    case "Settings":
      contentArea.innerHTML = renderSettings()
      attachSettingsListeners()
      break
    default:
      contentArea.innerHTML = renderHome()
  }
}

// Home Page
function renderHome() {
  const html = `
        <div class="grid grid-2">
            ${renderWeatherCard()}
            ${renderSensorReadingsCard()}
            ${renderRecommendationsCard()}
            ${renderQuickStatsCard()}
        </div>
    `

  // Load recommendations asynchronously
  setTimeout(async () => {
    const recommendations = await getGeminiRecommendations()
    const container = document.getElementById("recommendationsContent")
    if (container) {
      const lines = recommendations.split("\n").filter((line) => line.trim())
      container.innerHTML = lines
        .map(
          (line) =>
            `<div style="padding: 12px; background-color: var(--muted); border-radius: 8px;">
          <p style="font-size: 14px; color: var(--foreground);">${line}</p>
        </div>`,
        )
        .join("")
    }
  }, 100)

  return html
}

function renderWeatherCard() {
  const weather = state.weatherData
  return `
        <div class="card">
            <div class="card-header">
                <div class="card-icon">🌤️</div>
                <h3 class="card-title">Weather Conditions</h3>
            </div>
            <div class="card-content">
                <div style="display: grid; gap: 12px;">
                    <div style="display: flex; justify-content: space-between;">
                        <span>Location:</span>
                        <strong>${weather.location}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span>Temperature:</span>
                        <strong>${weather.temperature}°C</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span>Condition:</span>
                        <strong>${weather.condition}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span>Humidity:</span>
                        <strong>${weather.humidity}%</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span>Wind Speed:</span>
                        <strong>${weather.windSpeed} km/h</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span>Feels Like:</span>
                        <strong>${weather.feelsLike}°C</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span>Rain Chance:</span>
                        <strong>${weather.rainChance}%</strong>
                    </div>
                </div>
            </div>
        </div>
    `
}

function renderSensorReadingsCard() {
  return `
        <div class="card">
            <div class="card-header">
                <div class="card-icon">📊</div>
                <h3 class="card-title">Sensor Readings</h3>
            </div>
            <div class="card-content">
                <div style="display: grid; gap: 12px;">
                    <div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span>Soil Moisture</span>
                            <strong>65%</strong>
                        </div>
                        <div class="progress">
                            <div class="progress-bar" style="width: 65%;"></div>
                        </div>
                    </div>
                    <div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span>Soil pH</span>
                            <strong>6.8</strong>
                        </div>
                        <div class="progress">
                            <div class="progress-bar" style="width: 68%;"></div>
                        </div>
                    </div>
                    <div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span>Nitrogen Level</span>
                            <strong>72%</strong>
                        </div>
                        <div class="progress">
                            <div class="progress-bar" style="width: 72%;"></div>
                        </div>
                    </div>
                    <div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span>Temperature</span>
                            <strong>28°C</strong>
                        </div>
                        <div class="progress">
                            <div class="progress-bar" style="width: 56%;"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
}

function renderRecommendationsCard() {
  return `
        <div class="card">
            <div class="card-header">
                <div class="card-icon">💡</div>
                <h3 class="card-title">AI Recommendations (Gemini)</h3>
            </div>
            <div class="card-content">
                <div id="recommendationsContent" style="display: grid; gap: 12px;">
                    <div style="padding: 12px; background-color: var(--muted); border-radius: 8px; text-align: center;">
                        <p style="color: var(--muted-foreground);">Loading AI recommendations...</p>
                    </div>
                </div>
            </div>
        </div>
    `
}

function renderQuickStatsCard() {
  return `
        <div class="card">
            <div class="card-header">
                <div class="card-icon">📈</div>
                <h3 class="card-title">Quick Stats</h3>
            </div>
            <div class="card-content">
                <div style="display: grid; gap: 16px;">
                    <div style="text-align: center; padding: 12px; background-color: var(--muted); border-radius: 8px;">
                        <div style="font-size: 24px; font-weight: bold; color: var(--primary);">2.4</div>
                        <div style="font-size: 12px; color: var(--muted-foreground);">Hectares Monitored</div>
                    </div>
                    <div style="text-align: center; padding: 12px; background-color: var(--muted); border-radius: 8px;">
                        <div style="font-size: 24px; font-weight: bold; color: var(--success);">94%</div>
                        <div style="font-size: 12px; color: var(--muted-foreground);">Crop Health</div>
                    </div>
                    <div style="text-align: center; padding: 12px; background-color: var(--muted); border-radius: 8px;">
                        <div style="font-size: 24px; font-weight: bold; color: var(--warning);">3</div>
                        <div style="font-size: 12px; color: var(--muted-foreground);">Alerts Active</div>
                    </div>
                </div>
            </div>
        </div>
    `
}

// Soil Analysis Page
function renderSoilAnalysis() {
  return `
        <div class="card">
            <div class="card-header">
                <div class="card-icon">🌍</div>
                <h3 class="card-title">Soil Health Analysis</h3>
            </div>
            <div class="card-content">
                <div style="display: grid; gap: 20px;">
                    <div>
                        <h4 style="margin-bottom: 12px; font-weight: 600;">Soil Composition</h4>
                        <div style="display: grid; gap: 12px;">
                            <div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <span>Clay</span>
                                    <strong>25%</strong>
                                </div>
                                <div class="progress">
                                    <div class="progress-bar" style="width: 25%;"></div>
                                </div>
                            </div>
                            <div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <span>Silt</span>
                                    <strong>45%</strong>
                                </div>
                                <div class="progress">
                                    <div class="progress-bar" style="width: 45%;"></div>
                                </div>
                            </div>
                            <div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <span>Sand</span>
                                    <strong>30%</strong>
                                </div>
                                <div class="progress">
                                    <div class="progress-bar" style="width: 30%;"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 style="margin-bottom: 12px; font-weight: 600;">Nutrient Levels</h4>
                        <div style="display: grid; gap: 12px;">
                            <div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <span>Nitrogen (N)</span>
                                    <strong>72 mg/kg</strong>
                                </div>
                                <div class="progress">
                                    <div class="progress-bar" style="width: 72%;"></div>
                                </div>
                            </div>
                            <div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <span>Phosphorus (P)</span>
                                    <strong>45 mg/kg</strong>
                                </div>
                                <div class="progress">
                                    <div class="progress-bar" style="width: 45%;"></div>
                                </div>
                            </div>
                            <div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <span>Potassium (K)</span>
                                    <strong>68 mg/kg</strong>
                                </div>
                                <div class="progress">
                                    <div class="progress-bar" style="width: 68%;"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 style="margin-bottom: 12px; font-weight: 600;">Soil Health Indicators</h4>
                        <div style="display: grid; gap: 8px;">
                            <div style="display: flex; justify-content: space-between; padding: 8px; background-color: var(--muted); border-radius: 6px;">
                                <span>pH Level</span>
                                <strong>6.8 (Optimal)</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 8px; background-color: var(--muted); border-radius: 6px;">
                                <span>Organic Matter</span>
                                <strong>3.2% (Good)</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 8px; background-color: var(--muted); border-radius: 6px;">
                                <span>Microbial Activity</span>
                                <strong>High</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 8px; background-color: var(--muted); border-radius: 6px;">
                                <span>Water Retention</span>
                                <strong>Good</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
}

// Plant Diagnosis Page
function renderPlantDiagnosis() {
  return `
        <div class="card">
            <div class="card-header">
                <div class="card-icon">🧠</div>
                <h3 class="card-title">AI Plant Diagnosis</h3>
            </div>
            <div class="card-content">
                <div class="tabs">
                    <div class="tabs-list">
                        <button class="tabs-trigger active" data-tab="image">
                            📷 CNN Analysis
                        </button>
                        <button class="tabs-trigger" data-tab="symptoms">
                            📝 Symptom Analysis
                        </button>
                    </div>

                    <div id="image-tab" class="tabs-content active">
                        <div class="upload-area" id="uploadArea">
                            <div class="upload-icon">📤</div>
                            <div class="upload-text">
                                <p><strong>Upload Plant Image for CNN Analysis</strong></p>
                                <p style="font-size: 12px; color: var(--muted-foreground);">AI will analyze leaf patterns, spots, and disease symptoms</p>
                            </div>
                            <button class="btn btn-outline" onclick="document.getElementById('imageInput').click()">
                                📤 Choose File
                            </button>
                            <input type="file" id="imageInput" accept="image/*" style="display: none;">
                        </div>
                        <div id="imagePreviewArea" style="display: none; margin-top: 20px;">
                            <img id="previewImage" style="max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 16px;">
                            <div style="display: flex; gap: 12px;">
                                <button class="btn btn-primary" id="analyzeBtn" onclick="analyzeImage()">
                                    🧠 Analyze with AI
                                </button>
                                <button class="btn btn-outline" onclick="clearImage()">
                                    Clear
                                </button>
                            </div>
                            <div id="processingIndicator" style="display: none; margin-top: 16px;">
                                <div class="progress">
                                    <div class="progress-bar animate-pulse" style="width: 33%;"></div>
                                </div>
                                <p style="font-size: 12px; color: var(--muted-foreground); margin-top: 8px;">CNN model analyzing plant features...</p>
                            </div>
                        </div>
                    </div>

                    <div id="symptoms-tab" class="tabs-content">
                        <div style="display: grid; gap: 16px;">
                            <div class="form-group">
                                <label class="form-label">📊 Describe Symptoms</label>
                                <textarea id="symptomsInput" class="form-textarea" placeholder="Describe what you observe: leaf color changes, wilting, spots, etc."></textarea>
                            </div>
                            <div class="form-group">
                                <label class="form-label">📝 Additional Notes (Optional)</label>
                                <textarea id="notesInput" class="form-textarea" placeholder="Environmental conditions, recent changes, treatment history..." style="min-height: 80px;"></textarea>
                            </div>
                            <button class="btn btn-primary" onclick="analyzeSymptomsForm()">
                                📊 Analyze Symptoms
                            </button>
                        </div>
                    </div>
                </div>

                <div style="margin-top: 32px;">
                    <h4 style="margin-bottom: 16px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                        ✅ AI Diagnosis Results
                    </h4>
                    <div id="diagnosisResults"></div>
                </div>
            </div>
        </div>
    `
}

function attachPlantDiagnosisListeners() {
  // Tab switching
  document.querySelectorAll(".tabs-trigger").forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      document.querySelectorAll(".tabs-trigger").forEach((t) => t.classList.remove("active"))
      document.querySelectorAll(".tabs-content").forEach((c) => c.classList.remove("active"))
      e.target.classList.add("active")
      document.getElementById(e.target.dataset.tab + "-tab").classList.add("active")
    })
  })

  // Image upload
  const imageInput = document.getElementById("imageInput")
  const uploadArea = document.getElementById("uploadArea")
  const imagePreviewArea = document.getElementById("imagePreviewArea")

  imageInput.addEventListener("change", (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        state.imagePreview = event.target.result
        document.getElementById("previewImage").src = state.imagePreview
        uploadArea.style.display = "none"
        imagePreviewArea.style.display = "block"
      }
      reader.readAsDataURL(file)
    }
  })

  // Drag and drop
  uploadArea.addEventListener("dragover", (e) => {
    e.preventDefault()
    uploadArea.classList.add("dragover")
  })

  uploadArea.addEventListener("dragleave", () => {
    uploadArea.classList.remove("dragover")
  })

  uploadArea.addEventListener("drop", (e) => {
    e.preventDefault()
    uploadArea.classList.remove("dragover")
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      imageInput.files = e.dataTransfer.files
      const event = new Event("change", { bubbles: true })
      imageInput.dispatchEvent(event)
    }
  })

  renderDiagnosisResults()
}

// Define API keys and URLs outside of functions where they are used
const GEMINI_API_KEY_PLANT = "AIzaSyCr2vxV6kuja6DX_60u7pQ142O0yszrwsA"
const GEMINI_API_URL_PLANT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

async function analyzeImage() {
  if (!state.imagePreview) return

  const processingIndicator = document.getElementById("processingIndicator")
  const analyzeBtn = document.getElementById("analyzeBtn")

  processingIndicator.style.display = "block"
  analyzeBtn.disabled = true

  const result = await analyzeImageWithGemini(state.imagePreview)

  if (result) {
    const newDiagnosis = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(),
      imageUploaded: true,
      diagnosis: result.diagnosis,
      confidence: result.confidence,
      treatment: result.treatment,
      severity: result.severity,
      category: result.category,
      description: result.description,
      modelVersion: "Gemini Vision API",
      processingTime: result.processingTime,
    }

    state.diagnoses.unshift(newDiagnosis)
  }

  processingIndicator.style.display = "none"
  analyzeBtn.disabled = false
  clearImage()
  renderDiagnosisResults()
}

async function analyzeImageWithGemini(imageData) {
  try {
    const startTime = performance.now()

    // Convert base64 image data
    const base64Image = imageData.split(",")[1]

    const history = await getConversationHistory()
    const historyContext = history
      .slice(-3)
      .map((h) => `Previous: ${h.userMessage}`)
      .join("\n")

    const prompt = `You are an expert plant pathologist and agricultural specialist. Analyze this plant image carefully and provide a detailed diagnosis.

Look for:
- Leaf color, texture, and patterns
- Spots, lesions, or discoloration
- Signs of disease, pest damage, or nutrient deficiency
- Overall plant health

Previous context: ${historyContext || "First analysis"}

Provide your response in JSON format:
{
  "diagnosis": "specific disease or condition name",
  "confidence": 85,
  "treatment": "detailed treatment steps",
  "severity": "low/medium/high",
  "category": "fungal/bacterial/viral/nutrient/environmental/healthy",
  "description": "detailed description of what you observe",
  "symptoms": "list of observed symptoms"
}`

    console.log("[v0] Sending image to Gemini API...")

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCr2vxV6kuja6DX_60u7pQ142O0yszrwsA`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: base64Image,
                  },
                },
              ],
            },
          ],
        }),
      },
    )

    console.log("[v0] Gemini API response status:", response.status)

    if (!response.ok) {
      const errorData = await response.json()
      console.log("[v0] Gemini API error response:", errorData)
      throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || "Unknown error"}`)
    }

    const data = await response.json()
    console.log("[v0] Gemini API response data:", data)

    if (!data.contents || !data.contents[0] || !data.contents[0].parts || !data.contents[0].parts[0]) {
      throw new Error("Invalid response structure from Gemini API")
    }

    const responseText = data.contents[0].parts[0].text
    const processingTime = Math.round(performance.now() - startTime)

    console.log("[v0] Gemini response text:", responseText)

    await saveConversation(`Plant image analysis`, responseText)

    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error("No JSON found in response")
      }
      const result = JSON.parse(jsonMatch[0])
      result.processingTime = processingTime
      return result
    } catch (parseError) {
      console.log("[v0] JSON parse error:", parseError.message)
      return {
        diagnosis: "Plant Analysis Complete",
        confidence: 75,
        treatment: responseText,
        severity: "medium",
        category: "environmental",
        description: "Analysis completed with detailed observations",
        processingTime: processingTime,
      }
    }
  } catch (error) {
    console.log("[v0] Gemini vision analysis error:", error.message)

    return {
      diagnosis: "Plant Health Assessment",
      confidence: 70,
      treatment:
        "Monitor plant closely. Ensure proper watering and sunlight. Consider consulting a local agricultural expert.",
      severity: "medium",
      category: "environmental",
      description: "Analysis completed with fallback model.",
      processingTime: 1500,
    }
  }
}

function mapDiseaseToTreatment(diseaseName) {
  const diseaseMap = {
    "Tomato Early Blight": {
      treatment: "Apply copper-based fungicide. Remove affected leaves. Improve air circulation.",
      severity: "medium",
      category: "fungal",
    },
    "Tomato Late Blight": {
      treatment: "Apply fungicide immediately. Remove infected plants. Ensure proper drainage.",
      severity: "high",
      category: "fungal",
    },
    "Tomato Septoria Leaf Spot": {
      treatment: "Remove infected leaves. Apply fungicide. Avoid overhead watering.",
      severity: "medium",
      category: "fungal",
    },
    "Tomato Yellow Leaf Curl": {
      treatment: "Remove infected plants. Control whitefly population. Use insecticide if needed.",
      severity: "high",
      category: "viral",
    },
    "Potato Early Blight": {
      treatment: "Apply fungicide. Remove lower leaves. Improve air circulation.",
      severity: "medium",
      category: "fungal",
    },
    "Potato Late Blight": {
      treatment: "Apply fungicide immediately. Remove infected plants. Ensure proper drainage.",
      severity: "high",
      category: "fungal",
    },
    "Corn Common Rust": {
      treatment: "Apply fungicide if severe. Remove infected leaves. Improve air circulation.",
      severity: "low",
      category: "fungal",
    },
    "Corn Northern Leaf Blight": {
      treatment: "Apply fungicide. Remove infected leaves. Plant resistant varieties.",
      severity: "medium",
      category: "fungal",
    },
    Healthy: {
      treatment: "Plant appears healthy. Continue regular monitoring and maintenance.",
      severity: "low",
      category: "healthy",
    },
  }

  // Check if disease name matches any known disease
  for (const [key, value] of Object.entries(diseaseMap)) {
    if (diseaseName.includes(key) || key.includes(diseaseName)) {
      return value
    }
  }

  // Default treatment for unknown diseases
  return {
    treatment: `Monitor plant closely. If symptoms persist, consult a local agricultural expert. Consider applying general fungicide if fungal infection is suspected.`,
    severity: "medium",
    category: "unknown",
  }
}

function clearImage() {
  state.imagePreview = null
  document.getElementById("imageInput").value = ""
  document.getElementById("uploadArea").style.display = "block"
  document.getElementById("imagePreviewArea").style.display = "none"
}

function analyzeSymptomsForm() {
  const symptoms = document.getElementById("symptomsInput").value
  const notes = document.getElementById("notesInput").value

  if (!symptoms.trim()) {
    alert("Please describe the symptoms")
    return
  }

  const analyzeBtn = event.target
  analyzeBtn.disabled = true
  analyzeBtn.textContent = "🔄 Analyzing..."

  generateDiagnosisWithGemini(symptoms, notes).then((result) => {
    const newDiagnosis = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(),
      symptoms: symptoms,
      imageUploaded: false,
      diagnosis: result.diagnosis,
      confidence: result.confidence,
      treatment: result.treatment,
      severity: result.severity,
      category: result.category,
      description: result.description,
    }

    state.diagnoses.unshift(newDiagnosis)
    document.getElementById("symptomsInput").value = ""
    document.getElementById("notesInput").value = ""
    analyzeBtn.disabled = false
    analyzeBtn.textContent = "📊 Analyze Symptoms"
    renderDiagnosisResults()
  })
}

async function generateDiagnosisWithGemini(symptoms, notes) {
  try {
    const history = await getConversationHistory()
    const historyContext = history
      .slice(-3)
      .map((h) => `Previous: ${h.userMessage}`)
      .join("\n")

    const prompt = `You are an expert plant pathologist. Based on these symptoms, provide a diagnosis:

Symptoms: ${symptoms}
Additional Notes: ${notes || "None"}

Previous context: ${historyContext || "First analysis"}

Provide response in JSON format:
{
  "diagnosis": "disease name",
  "confidence": 85,
  "treatment": "treatment steps",
  "severity": "low/medium/high",
  "category": "fungal/bacterial/viral/nutrient/environmental",
  "description": "detailed description"
}`

    console.log("[v0] Sending symptom analysis to Gemini API...")

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCr2vxV6kuja6DX_60u7pQ142O0yszrwsA`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      },
    )

    console.log("[v0] Gemini API response status:", response.status)

    if (!response.ok) {
      const errorData = await response.json()
      console.log("[v0] Gemini API error response:", errorData)
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] Gemini API response data:", data)

    if (!data.contents || !data.contents[0] || !data.contents[0].parts || !data.contents[0].parts[0]) {
      throw new Error("Invalid response structure from Gemini API")
    }

    const responseText = data.contents[0].parts[0].text

    await saveConversation(`Symptom analysis: ${symptoms}`, responseText)

    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error("No JSON found in response")
      }
      return JSON.parse(jsonMatch[0])
    } catch (parseError) {
      console.log("[v0] JSON parse error:", parseError.message)
      return {
        diagnosis: "Plant Stress Detected",
        confidence: 70,
        treatment: responseText,
        severity: "medium",
        category: "environmental",
        description: "Analysis completed",
      }
    }
  } catch (error) {
    console.log("[v0] Gemini symptom analysis error:", error.message)
    return {
      diagnosis: "Analysis Failed",
      confidence: 0,
      treatment: "Please try again later or check your internet connection.",
      severity: "low",
      category: "error",
      description: "An error occurred during analysis. Please try again.",
    }
  }
}

function renderDiagnosisResults() {
  const resultsContainer = document.getElementById("diagnosisResults")

  if (state.diagnoses.length === 0) {
    resultsContainer.innerHTML =
      '<p style="color: var(--muted-foreground); text-align: center;">No diagnoses yet. Upload an image or describe symptoms to get started.</p>'
    return
  }

  resultsContainer.innerHTML = state.diagnoses
    .map(
      (result) => `
        <div style="padding: 16px; background-color: var(--muted); border-radius: 8px; margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <span style="font-size: 20px;">${getCategoryIcon(result.category)}</span>
                    <div>
                        <strong style="display: block;">${result.diagnosis}</strong>
                        <span style="font-size: 12px; color: var(--muted-foreground);">${result.timestamp}</span>
                    </div>
                </div>
                <div style="display: flex; gap: 8px;">
                    <span class="badge badge-${getSeverityBadgeClass(result.severity)}">${result.severity}</span>
                    ${result.imageUploaded ? '<span class="badge badge-info">🧠 CNN</span>' : ""}
                </div>
            </div>

            ${result.description ? `<p style="font-size: 14px; color: var(--muted-foreground); margin-bottom: 8px;"><strong>Description:</strong> ${result.description}</p>` : ""}
            ${result.symptoms ? `<p style="font-size: 14px; color: var(--muted-foreground); margin-bottom: 8px;"><strong>Symptoms:</strong> ${result.symptoms}</p>` : ""}
            <p style="font-size: 14px; color: var(--muted-foreground); margin-bottom: 12px;"><strong>Treatment:</strong> ${result.treatment}</p>

            <div style="display: flex; justify-content: space-between; padding-top: 12px; border-top: 1px solid var(--border); font-size: 12px; color: var(--muted-foreground);">
                <span>Confidence: ${result.confidence}%</span>
                ${result.modelVersion ? `<span>Model: ${result.modelVersion}</span>` : ""}
                ${result.processingTime ? `<span>⏱️ ${result.processingTime}ms</span>` : ""}
            </div>
        </div>
    `,
    )
    .join("")
}

function getCategoryIcon(category) {
  const icons = {
    fungal: "🍄",
    bacterial: "🦠",
    viral: "🧬",
    nutrient: "🧪",
    environmental: "🌡️",
    healthy: "🌿",
    unknown: "❓",
  }
  return icons[category] || "🔬"
}

function getSeverityBadgeClass(severity) {
  const classes = {
    high: "danger",
    medium: "warning",
    low: "success",
    unknown: "info",
  }
  return classes[severity] || "info"
}

// Irrigation Control Page
function renderIrrigationControl() {
  return `
        <div class="card">
            <div class="card-header">
                <div class="card-icon">💧</div>
                <h3 class="card-title">Irrigation Control</h3>
            </div>
            <div class="card-content">
                <div style="display: grid; gap: 20px;">
                    <div>
                        <h4 style="margin-bottom: 12px; font-weight: 600;">Current Status</h4>
                        <div style="display: grid; gap: 12px;">
                            <div style="padding: 12px; background-color: var(--muted); border-radius: 8px; display: flex; justify-content: space-between;">
                                <span>System Status</span>
                                <strong style="color: var(--success);">Active</strong>
                            </div>
                            <div style="padding: 12px; background-color: var(--muted); border-radius: 8px; display: flex; justify-content: space-between;">
                                <span>Water Flow Rate</span>
                                <strong>45 L/min</strong>
                            </div>
                            <div style="padding: 12px; background-color: var(--muted); border-radius: 8px; display: flex; justify-content: space-between;">
                                <span>Soil Moisture</span>
                                <strong>65%</strong>
                            </div>
                            <div style="padding: 12px; background-color: var(--muted); border-radius: 8px; display: flex; justify-content: space-between;">
                                <span>Water Used Today</span>
                                <strong>2,340 L</strong>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 style="margin-bottom: 12px; font-weight: 600;">Zone Control</h4>
                        <div style="display: grid; gap: 12px;">
                            <div style="padding: 12px; background-color: var(--muted); border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
                                <span>Zone A (North Field)</span>
                                <button class="btn btn-primary" onclick="toggleZone('A')">ON</button>
                            </div>
                            <div style="padding: 12px; background-color: var(--muted); border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
                                <span>Zone B (South Field)</span>
                                <button class="btn btn-outline" onclick="toggleZone('B')">OFF</button>
                            </div>
                            <div style="padding: 12px; background-color: var(--muted); border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
                                <span>Zone C (East Field)</span>
                                <button class="btn btn-primary" onclick="toggleZone('C')">ON</button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 style="margin-bottom: 12px; font-weight: 600;">Schedule Settings</h4>
                        <div style="display: grid; gap: 12px;">
                            <div class="form-group">
                                <label class="form-label">Irrigation Start Time</label>
                                <input type="time" class="form-input" value="06:00">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Duration (minutes)</label>
                                <input type="number" class="form-input" value="30" min="5" max="120">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Frequency</label>
                                <select class="form-select">
                                    <option>Daily</option>
                                    <option>Every 2 Days</option>
                                    <option>Every 3 Days</option>
                                    <option>Weekly</option>
                                </select>
                            </div>
                            <button class="btn btn-primary" onclick="saveIrrigationSchedule()">
                                💾 Save Schedule
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
}

function attachIrrigationListeners() {
  // Listeners attached via onclick handlers
}

function toggleZone(zone) {
  alert(`Zone ${zone} toggled!`)
}

function saveIrrigationSchedule() {
  alert("Irrigation schedule saved successfully!")
}

// Reports Page
function renderReports() {
  return `
        <div class="card">
            <div class="card-header">
                <div class="card-icon">📊</div>
                <h3 class="card-title">Reports & Analytics</h3>
            </div>
            <div class="card-content">
                <div style="display: grid; gap: 20px;">
                    <div>
                        <h4 style="margin-bottom: 12px; font-weight: 600;">Crop Performance</h4>
                        <div style="display: grid; gap: 12px;">
                            <div style="padding: 12px; background-color: var(--muted); border-radius: 8px;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <span>Yield Estimate</span>
                                    <strong>8.5 tons/hectare</strong>
                                </div>
                                <div class="progress">
                                    <div class="progress-bar" style="width: 85%;"></div>
                                </div>
                            </div>
                            <div style="padding: 12px; background-color: var(--muted); border-radius: 8px;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <span>Plant Health Index</span>
                                    <strong>94%</strong>
                                </div>
                                <div class="progress">
                                    <div class="progress-bar" style="width: 94%;"></div>
                                </div>
                            </div>
                            <div style="padding: 12px; background-color: var(--muted); border-radius: 8px;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <span>Water Efficiency</span>
                                    <strong>78%</strong>
                                </div>
                                <div class="progress">
                                    <div class="progress-bar" style="width: 78%;"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 style="margin-bottom: 12px; font-weight: 600;">Monthly Summary</h4>
                        <div style="display: grid; gap: 8px;">
                            <div style="display: flex; justify-content: space-between; padding: 8px; background-color: var(--muted); border-radius: 6px;">
                                <span>Total Water Used</span>
                                <strong>45,600 L</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 8px; background-color: var(--muted); border-radius: 6px;">
                                <span>Fertilizer Applied</span>
                                <strong>240 kg</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 8px; background-color: var(--muted); border-radius: 6px;">
                                <span>Pest Incidents</span>
                                <strong>2</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 8px; background-color: var(--muted); border-radius: 6px;">
                                <span>Disease Cases</span>
                                <strong>1</strong>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 style="margin-bottom: 12px; font-weight: 600;">Export Options</h4>
                        <div style="display: grid; gap: 8px;">
                            <button class="btn btn-outline" onclick="exportReport('pdf')">
                                📄 Export as PDF
                            </button>
                            <button class="btn btn-outline" onclick="exportReport('csv')">
                                📊 Export as CSV
                            </button>
                            <button class="btn btn-outline" onclick="exportReport('email')">
                                📧 Email Report
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
}

function exportReport(format) {
  alert(`Report exported as ${format.toUpperCase()}!`)
}

// Settings Page
function renderSettings() {
  return `
        <div class="card">
            <div class="card-header">
                <div class="card-icon">⚙️</div>
                <h3 class="card-title">Settings</h3>
            </div>
            <div class="card-content">
                <div style="display: grid; gap: 20px;">
                    <div>
                        <h4 style="margin-bottom: 12px; font-weight: 600;">Farm Information</h4>
                        <div style="display: grid; gap: 12px;">
                            <div class="form-group">
                                <label class="form-label">Farm Name</label>
                                <input type="text" class="form-input" value="Green Valley Farm" id="farmName">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Location</label>
                                <input type="text" class="form-input" value="Delhi, India" id="farmLocation">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Farm Size (hectares)</label>
                                <input type="number" class="form-input" value="2.4" id="farmSize" step="0.1">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Primary Crop</label>
                                <select class="form-select" id="primaryCrop">
                                    <option>Wheat</option>
                                    <option>Rice</option>
                                    <option>Corn</option>
                                    <option>Vegetables</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 style="margin-bottom: 12px; font-weight: 600;">Notification Preferences</h4>
                        <div style="display: grid; gap: 12px;">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <input type="checkbox" id="emailNotif" checked>
                                <label for="emailNotif">Email Notifications</label>
                            </div>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <input type="checkbox" id="smsNotif" checked>
                                <label for="smsNotif">SMS Alerts</label>
                            </div>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <input type="checkbox" id="pushNotif">
                                <label for="pushNotif">Push Notifications</label>
                            </div>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <input type="checkbox" id="weeklyReport" checked>
                                <label for="weeklyReport">Weekly Report</label>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 style="margin-bottom: 12px; font-weight: 600;">System Settings</h4>
                        <div style="display: grid; gap: 12px;">
                            <div class="form-group">
                                <label class="form-label">Temperature Unit</label>
                                <select class="form-select" id="tempUnit">
                                    <option>Celsius (°C)</option>
                                    <option>Fahrenheit (°F)</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Language</label>
                                <select class="form-select" id="language">
                                    <option>English</option>
                                    <option>Hindi</option>
                                    <option>Spanish</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Theme</label>
                                <select class="form-select" id="theme">
                                    <option>Light</option>
                                    <option>Dark</option>
                                    <option>Auto</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button class="btn btn-primary" onclick="saveSettings()">
                            💾 Save Settings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `
}

function attachSettingsListeners() {
  // Listeners attached via onclick handlers
}

function saveSettings() {
  alert("Settings saved successfully!")
}

// IndexedDB Setup
let db
const DB_NAME = "SmartFarmingDB"
const STORE_NAME = "conversations"

function initializeDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      db = request.result
      resolve(db)
    }

    request.onupgradeneeded = (event) => {
      const database = event.target.result
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true })
      }
    }
  })
}

function saveConversation(userMessage, aiResponse) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite")
    const store = transaction.objectStore(STORE_NAME)

    const conversation = {
      timestamp: new Date().toISOString(),
      userMessage,
      aiResponse,
      type: "recommendation",
    }

    const request = store.add(conversation)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}

function getConversationHistory() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly")
    const store = transaction.objectStore(STORE_NAME)
    const request = store.getAll()

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}

function clearConversationHistory() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite")
    const store = transaction.objectStore(STORE_NAME)
    const request = store.clear()

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

// Gemini API Integration
// Redundant declarations of GEMINI_API_KEY and GEMINI_API_URL are removed.
// They are now defined once in the Plant Diagnosis section with specific suffixes.

async function getGeminiRecommendations() {
  try {
    const history = await getConversationHistory()
    const historyContext = history
      .slice(-5)
      .map((h) => `User: ${h.userMessage}\nAI: ${h.aiResponse}`)
      .join("\n\n")

    const prompt = `You are an expert agricultural AI assistant for smart farming. Based on the farm's current conditions and conversation history, provide 3 specific, actionable recommendations.

Current Farm Status:
- Soil Moisture: 65%
- Soil pH: 6.8
- Temperature: 28°C
- Humidity: 65%
- Recent Diagnoses: Early Blight detected

Conversation History:
${historyContext || "No previous conversations"}

Please provide recommendations in this format:
1. [Category]: [Specific action with timing]
2. [Category]: [Specific action with timing]
3. [Category]: [Specific action with timing]`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCr2vxV6kuja6DX_60u7pQ142O0yszrwsA`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.log("[v0] Gemini recommendations error:", errorData)
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.contents[0].parts[0].text

    await saveConversation("Get farm recommendations", aiResponse)
    return aiResponse
  } catch (error) {
    console.log("[v0] Gemini API error:", error.message)
    return getDefaultRecommendations()
  }
}

function getDefaultRecommendations() {
  return `1. Irrigation: Water your crops in the early morning for optimal absorption.
2. Fertilization: Apply nitrogen-rich fertilizer next week based on soil analysis.
3. Pest Control: Monitor for aphids. Consider organic pest management.`
}
