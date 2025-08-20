import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Webhook endpoint is reachable',
    timestamp: new Date().toISOString(),
    url: request.url,
    method: 'GET'
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    
    return NextResponse.json({
      message: 'Webhook test endpoint received POST',
      timestamp: new Date().toISOString(),
      url: request.url,
      method: 'POST',
      bodyLength: body.length,
      bodyPreview: body.substring(0, 100) + (body.length > 100 ? '...' : ''),
      headers: Object.fromEntries(request.headers.entries())
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to process webhook test',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}