import { Leaf, Mail, Phone, Globe } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
              <Leaf className="w-5 h-5 text-primary" />
              <span>Contact Information</span>
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>support@spark-farming.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span>www.spark-farming.com</span>
              </div>
            </div>
          </div>

          {/* Sustainability Message */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Sustainable Farming</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {
                "SPARK is committed to revolutionizing agriculture through AI-powered insights and IoT technology. Together, we're building a more sustainable future, one farm at a time."
              }
            </p>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-green"></div>
              <span>Reducing water usage by 30% on average</span>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            © 2025 SPARK - Smart Plant Analysis and Regulated Kinetics. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
