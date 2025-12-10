import { NextRequest, NextResponse } from 'next/server'

const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:5000'

export async function POST(request: NextRequest) {
  try {
    const { source, language } = await request.json()

    if (!source) {
      return NextResponse.json({ error: 'No source provided' }, { status: 400 })
    }

    // Call the Python backend which uses the actual ndel library
    const response = await fetch(`${PYTHON_API_URL}/describe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source, language })
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json({
        error: error.error || 'Describe failed',
        fallback: true
      }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json({ output: data.output })

  } catch (error) {
    console.error('Error calling Python API:', error)

    // Return helpful error message
    return NextResponse.json({
      error: 'Unable to connect to NDEL backend. Make sure the Python server is running on port 5000.',
      hint: 'Run: python api_server.py'
    }, { status: 503 })
  }
}
