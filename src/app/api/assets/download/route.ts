import { NextRequest, NextResponse } from 'next/server'
import { figmaService } from '@/lib/figma'

/**
 * Asset Delivery Pipeline - Real Downloadable Files
 * Transforms Windows Ad Kit from mock URLs to actual usable advertising campaigns
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const assetId = searchParams.get('assetId')
    const nodeId = searchParams.get('nodeId')
    const format = searchParams.get('format') || 'PNG'
    const scale = parseInt(searchParams.get('scale') || '2')
    const download = searchParams.get('download') === 'true'

    if (!assetId && !nodeId) {
      return NextResponse.json(
        { error: 'Asset ID or Node ID is required' },
        { status: 400 }
      )
    }

    console.log(`📥 Asset download request: ${assetId || nodeId}`)

    const targetNodeId = nodeId || assetId

    // Export the asset using Figma API
    const exportResult = await figmaService.exportAdAsImage(targetNodeId!, {
      format: format as 'PNG' | 'JPG' | 'SVG' | 'PDF',
      scale,
    })

    if (!exportResult.url) {
      throw new Error('Failed to generate download URL')
    }

    // If download=true, fetch the actual file and stream it
    if (download) {
      try {
        const imageResponse = await fetch(exportResult.url)
        
        if (!imageResponse.ok) {
          throw new Error('Failed to fetch image from Figma')
        }

        const imageBuffer = await imageResponse.arrayBuffer()
        
        // Generate filename
        const filename = `windows-ad-kit-${assetId || targetNodeId}-${scale}x.${format.toLowerCase()}`
        
        // Return file as download
        return new NextResponse(imageBuffer, {
          headers: {
            'Content-Type': `image/${format.toLowerCase()}`,
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Content-Length': imageBuffer.byteLength.toString(),
            'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
          },
        })
      } catch (fetchError) {
        console.error('Failed to fetch image:', fetchError)
        // Fallback to redirect if direct download fails
        return NextResponse.redirect(exportResult.url)
      }
    }

    // Return download information
    return NextResponse.json({
      success: true,
      assetId: assetId || targetNodeId,
      nodeId: targetNodeId,
      downloadUrl: exportResult.url,
      format: exportResult.format,
      scale,
      width: exportResult.width,
      height: exportResult.height,
      filename: `windows-ad-kit-${assetId || targetNodeId}-${scale}x.${format.toLowerCase()}`,
      size: `${exportResult.width}x${exportResult.height}`,
      ready: true,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      created: new Date().toISOString(),
    })

  } catch (error) {
    console.error('Asset download error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to prepare asset download',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { 
      campaignId, 
      assetIds = [], 
      nodeIds = [], 
      format = 'PNG', 
      scale = 2,
      packageName 
    } = data

    if (!campaignId && assetIds.length === 0 && nodeIds.length === 0) {
      return NextResponse.json(
        { error: 'Campaign ID, Asset IDs, or Node IDs are required' },
        { status: 400 }
      )
    }

    console.log(`📦 Preparing asset package for campaign: ${campaignId}`)

    // Determine which assets to package
    let targetNodeIds = nodeIds.length > 0 ? nodeIds : assetIds

    // Batch export all assets
    const exportResults = await figmaService.batchExportAds(targetNodeIds, {
      format: format as 'PNG' | 'JPG',
      scale,
    })

    // Create asset package information
    const assets = exportResults.map((result, index) => ({
      id: `asset_${Date.now()}_${index}`,
      nodeId: result.nodeId,
      downloadUrl: result.url,
      format: result.format,
      scale,
      width: result.width,
      height: result.height,
      filename: `windows-ad-kit-${result.nodeId}-${scale}x.${format.toLowerCase()}`,
      size: `${result.width}x${result.height}`,
      ready: true,
    }))

    // In a full implementation, you might create a ZIP file here
    // For now, we return individual download URLs
    const packageInfo = {
      id: `package_${campaignId}_${Date.now()}`,
      campaignId,
      name: packageName || `Windows Ad Kit - Campaign ${campaignId}`,
      format,
      scale,
      totalAssets: assets.length,
      assets,
      packageUrl: null, // Would be ZIP download URL in full implementation
      individualDownloads: true,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      created: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      package: packageInfo,
      message: `Asset package ready with ${assets.length} files`,
    })

  } catch (error) {
    console.error('Asset package error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create asset package',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}