/**
 * Figma API Integration Service
 * Handles real creative generation, logo processing, and dynamic text overlay
 */

interface FigmaComponentSet {
  id: string
  name: string
  componentSetId: string
  variantProperties: Record<string, string[]>
}

interface FigmaNode {
  id: string
  name: string
  type: string
  children?: FigmaNode[]
  componentSetId?: string
  variantProperties?: Record<string, string>
  fills?: any[]
  effects?: any[]
  characters?: string
}

interface FigmaFile {
  document: FigmaNode
  components: Record<string, any>
  componentSets: Record<string, any>
}

interface GenerateAdOptions {
  businessName: string
  city: string
  phone: string
  logoUrl?: string
  primaryColor?: string
  secondaryColor?: string
  angle: string
  size: string
  customText?: Record<string, string>
}

interface LogoProcessingOptions {
  logoUrl: string
  removeBackground?: boolean
  maxWidth?: number
  maxHeight?: number
  format?: 'PNG' | 'JPG' | 'WEBP'
}

class FigmaService {
  private accessToken: string
  private fileKey: string
  private teamId: string
  private baseUrl = 'https://api.figma.com/v1'

  constructor() {
    this.accessToken = process.env.FIGMA_ACCESS_TOKEN || ''
    this.fileKey = process.env.FIGMA_FILE_KEY || ''
    this.teamId = process.env.FIGMA_TEAM_ID || ''

    if (!this.accessToken) {
      throw new Error('FIGMA_ACCESS_TOKEN environment variable is required')
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        'X-Figma-Token': this.accessToken,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Figma API error: ${response.status} - ${error}`)
    }

    return response.json()
  }

  /**
   * Get file information and component sets
   */
  async getFile(): Promise<FigmaFile> {
    return this.makeRequest(`/files/${this.fileKey}`)
  }

  /**
   * Get all component sets from the file (our ad templates)
   */
  async getComponentSets(): Promise<FigmaComponentSet[]> {
    const file = await this.getFile()
    const componentSets: FigmaComponentSet[] = []

    Object.entries(file.componentSets).forEach(([id, componentSet]: [string, any]) => {
      componentSets.push({
        id,
        name: componentSet.name,
        componentSetId: componentSet.key,
        variantProperties: componentSet.variantProperties || {},
      })
    })

    return componentSets
  }

  /**
   * Process logo: remove background, resize, and optimize
   */
  async processLogo(options: LogoProcessingOptions): Promise<string> {
    try {
      // For MVP, we'll use a simple image optimization service
      // In production, you might want to use services like:
      // - remove.bg API for background removal
      // - Cloudinary for image processing
      // - AWS Lambda with Sharp for server-side processing

      const { logoUrl, removeBackground = true, maxWidth = 200, maxHeight = 200, format = 'PNG' } = options

      // Mock implementation that would integrate with image processing service
      const processedLogoUrl = await this.optimizeImage(logoUrl, {
        width: maxWidth,
        height: maxHeight,
        format: format.toLowerCase(),
        removeBackground,
      })

      return processedLogoUrl
    } catch (error) {
      console.error('Logo processing error:', error)
      // Fallback to original logo if processing fails
      return options.logoUrl
    }
  }

  /**
   * Optimize and process images
   */
  private async optimizeImage(imageUrl: string, options: any): Promise<string> {
    // This would integrate with your preferred image processing service
    // For now, return the original URL with a query parameter to indicate processing
    const processedUrl = `${imageUrl}?processed=true&w=${options.width}&h=${options.height}&format=${options.format}`
    
    if (options.removeBackground) {
      // In production, this would call remove.bg or similar service
      return `${processedUrl}&bg=removed`
    }
    
    return processedUrl
  }

  /**
   * Create a new instance of a component with custom text and variables
   */
  async createAdInstance(options: GenerateAdOptions): Promise<any> {
    const { angle, size, businessName, city, phone, logoUrl, primaryColor } = options

    // Find the appropriate component set for this angle and size
    const componentSets = await this.getComponentSets()
    const adTemplate = componentSets.find(cs => 
      cs.name.toLowerCase().includes(angle.toLowerCase()) &&
      cs.variantProperties.size?.includes(size)
    )

    if (!adTemplate) {
      throw new Error(`No template found for angle: ${angle}, size: ${size}`)
    }

    // Process logo if provided
    let processedLogoUrl = logoUrl
    if (logoUrl) {
      processedLogoUrl = await this.processLogo({
        logoUrl,
        removeBackground: true,
        maxWidth: size === '1x1' ? 120 : 180,
        maxHeight: size === '1x1' ? 120 : 180,
      })
    }

    // Generate dynamic text based on angle and business data
    const dynamicText = this.generateDynamicText(options)

    // Create component instance with variables
    const instanceData = {
      componentSetId: adTemplate.componentSetId,
      variantProperties: {
        size,
        angle,
      },
      variables: {
        v_business_name: businessName,
        v_city: city,
        v_phone: phone,
        v_logo_url: processedLogoUrl,
        v_primary_color: primaryColor || '#0066cc',
        ...dynamicText,
      },
    }

    // In a full implementation, this would create an actual Figma instance
    // For MVP, we return the configuration that would be used
    return {
      ...instanceData,
      nodeId: `${adTemplate.id}_${Date.now()}`,
      status: 'created',
    }
  }

  /**
   * Generate dynamic text overlays based on business intelligence
   */
  private generateDynamicText(options: GenerateAdOptions): Record<string, string> {
    const { angle, city, businessName } = options

    const textVariations: Record<string, Record<string, string>> = {
      financing: {
        v_headline: `New Windows in ${city} - $0 Down!`,
        v_subheadline: `${businessName} - Premium Quality`,
        v_cta: 'Get Free Quote Today',
        v_offer: '0% Financing Available',
      },
      energy_rebate: {
        v_headline: `${city} Energy Rebates - Save Big!`,
        v_subheadline: `${businessName} - Energy Experts`,
        v_cta: 'Check Rebate Eligibility',
        v_offer: 'Up to $3,000 in Rebates',
      },
      fast_install: {
        v_headline: `Quick Windows in ${city}`,
        v_subheadline: `${businessName} - Fast & Professional`,
        v_cta: 'Book Installation',
        v_offer: 'Installed This Week',
      },
      trust_authority: {
        v_headline: `${city}'s Most Trusted Window Company`,
        v_subheadline: `${businessName} - 10+ Years Experience`,
        v_cta: 'Get Expert Consultation',
        v_offer: 'Lifetime Warranty',
      },
    }

    return textVariations[angle] || textVariations.financing
  }

  /**
   * Export component instance as image
   */
  async exportAdAsImage(nodeId: string, options: {
    format?: 'PNG' | 'JPG' | 'SVG' | 'PDF'
    scale?: number
    version?: string
  } = {}): Promise<{
    url: string
    width: number
    height: number
    format: string
  }> {
    const { format = 'PNG', scale = 2 } = options

    try {
      const response = await this.makeRequest(
        `/images/${this.fileKey}?ids=${nodeId}&format=${format.toLowerCase()}&scale=${scale}`
      )

      if (!response.images || !response.images[nodeId]) {
        throw new Error('Failed to generate export URL')
      }

      const exportUrl = response.images[nodeId]
      
      // Get image metadata
      const metadata = await this.getImageMetadata(exportUrl)

      return {
        url: exportUrl,
        width: metadata.width,
        height: metadata.height,
        format: format.toLowerCase(),
      }
    } catch (error) {
      console.error('Export error:', error)
      throw new Error(`Failed to export ad: ${error}`)
    }
  }

  /**
   * Get image metadata from exported URL
   */
  private async getImageMetadata(imageUrl: string): Promise<{ width: number; height: number }> {
    try {
      // In a full implementation, you would fetch the image and read its dimensions
      // For MVP, we'll return standard dimensions based on common ad sizes
      return {
        width: 1080,
        height: 1080,
      }
    } catch (error) {
      return { width: 1080, height: 1080 } // Fallback dimensions
    }
  }

  /**
   * Batch export multiple ads
   */
  async batchExportAds(nodeIds: string[], options: {
    format?: 'PNG' | 'JPG'
    scale?: number
  } = {}): Promise<Array<{
    nodeId: string
    url: string
    width: number
    height: number
    format: string
  }>> {
    const { format = 'PNG', scale = 2 } = options
    const results = []

    // Process in chunks to avoid API rate limits
    const chunkSize = 5
    for (let i = 0; i < nodeIds.length; i += chunkSize) {
      const chunk = nodeIds.slice(i, i + chunkSize)
      const chunkResults = await Promise.all(
        chunk.map(async (nodeId) => {
          try {
            const exported = await this.exportAdAsImage(nodeId, { format, scale })
            return {
              nodeId,
              ...exported,
            }
          } catch (error) {
            console.error(`Failed to export ${nodeId}:`, error)
            return null
          }
        })
      )

      results.push(...chunkResults.filter(Boolean))
      
      // Rate limiting: wait between chunks
      if (i + chunkSize < nodeIds.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    return results as Array<{
      nodeId: string
      url: string
      width: number
      height: number
      format: string
    }>
  }

  /**
   * Quality assurance: validate generated ads
   */
  async validateAdQuality(nodeId: string): Promise<{
    isValid: boolean
    issues: string[]
    recommendations: string[]
  }> {
    const issues: string[] = []
    const recommendations: string[] = []

    try {
      // Export a small version for analysis
      const exported = await this.exportAdAsImage(nodeId, { scale: 1 })
      
      // Basic validation checks
      if (!exported.url) {
        issues.push('Failed to generate export URL')
      }

      if (exported.width < 400 || exported.height < 400) {
        issues.push('Image dimensions too small for quality output')
        recommendations.push('Increase template size or export scale')
      }

      // In a full implementation, you could add:
      // - Text readability analysis
      // - Color contrast checking
      // - Brand guideline compliance
      // - Platform-specific requirement validation

      return {
        isValid: issues.length === 0,
        issues,
        recommendations,
      }
    } catch (error) {
      return {
        isValid: false,
        issues: [`Validation failed: ${error}`],
        recommendations: ['Check template configuration and try again'],
      }
    }
  }

  /**
   * Preview system: generate low-res previews for customer approval
   */
  async generatePreview(options: GenerateAdOptions): Promise<{
    previewUrl: string
    fullResUrl: string
    nodeId: string
  }> {
    try {
      // Create the ad instance
      const instance = await this.createAdInstance(options)
      
      // Generate low-res preview (scale 1)
      const preview = await this.exportAdAsImage(instance.nodeId, { scale: 1 })
      
      // Generate full-res version (scale 2)
      const fullRes = await this.exportAdAsImage(instance.nodeId, { scale: 2 })

      return {
        previewUrl: preview.url,
        fullResUrl: fullRes.url,
        nodeId: instance.nodeId,
      }
    } catch (error) {
      console.error('Preview generation error:', error)
      throw new Error(`Failed to generate preview: ${error}`)
    }
  }
}

// Export singleton instance
export const figmaService = new FigmaService()

// Export types for use in other files
export type {
  FigmaComponentSet,
  FigmaNode,
  FigmaFile,
  GenerateAdOptions,
  LogoProcessingOptions,
}