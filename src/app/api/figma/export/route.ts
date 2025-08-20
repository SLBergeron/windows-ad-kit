import { NextRequest, NextResponse } from 'next/server'
import { figmaService } from '@/lib/figma'

export async function POST(request: NextRequest) {
  try {
    const { adId, nodeId, format = 'PNG', scale = 2 } = await request.json()

    if (!adId && !nodeId) {
      return NextResponse.json(
        { error: 'Ad ID or Node ID is required' },
        { status: 400 }
      )
    }

    console.log(`🖼️ Exporting ad with Figma API: ${adId || nodeId}`)
    
    // Use nodeId if provided, otherwise try to derive from adId
    const targetNodeId = nodeId || adId
    
    // Export using real Figma API
    const exportResult = await figmaService.exportAdAsImage(targetNodeId, {
      format: format as 'PNG' | 'JPG' | 'SVG' | 'PDF',
      scale: parseInt(scale.toString()),
    })
    
    // Generate filename
    const filename = `${adId || targetNodeId}-${scale}x.${format.toLowerCase()}`
    
    return NextResponse.json({
      success: true,
      adId: adId || targetNodeId,
      nodeId: targetNodeId,
      exportUrl: exportResult.url,
      format: exportResult.format,
      scale,
      filename,
      width: exportResult.width,
      height: exportResult.height,
      size: `${exportResult.width}x${exportResult.height}`,
      created: new Date().toISOString(),
    })

  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to export ad',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const campaignId = searchParams.get('campaignId')
    const nodeIds = searchParams.get('nodeIds')?.split(',') || []
    const format = searchParams.get('format') || 'PNG'
    const scale = parseInt(searchParams.get('scale') || '2')

    if (!campaignId && nodeIds.length === 0) {
      return NextResponse.json(
        { error: 'Campaign ID or Node IDs are required' },
        { status: 400 }
      )
    }

    console.log(`📦 Batch exporting ads for campaign: ${campaignId}`)

    let targetNodeIds = nodeIds

    // If we have a campaignId but no nodeIds, we'd need to fetch from database
    // For now, we'll use the provided nodeIds or return empty result
    if (targetNodeIds.length === 0) {
      return NextResponse.json({
        success: true,
        campaignId,
        exports: [],
        totalExports: 0,
        message: 'No node IDs provided for export',
      })
    }

    // Batch export using real Figma API
    const exportResults = await figmaService.batchExportAds(targetNodeIds, {
      format: format as 'PNG' | 'JPG',
      scale,
    })

    // Format results
    const exports = exportResults.map((result, index) => ({
      id: `export_${Date.now()}_${index}`,
      adId: `ad_${result.nodeId}`,
      nodeId: result.nodeId,
      exportUrl: result.url,
      format: result.format,
      scale: scale.toString(),
      width: result.width,
      height: result.height,
      status: 'completed',
      created: new Date().toISOString(),
    }))

    return NextResponse.json({
      success: true,
      campaignId,
      exports,
      totalExports: exports.length,
      message: `Successfully exported ${exports.length} ads`,
    })

  } catch (error) {
    console.error('Batch export error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to batch export ads',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}