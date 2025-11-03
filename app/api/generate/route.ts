import { NextRequest, NextResponse } from 'next/server'

function toNDEL(text: string): string {
  const lower = text.toLowerCase()
  const conditions = []
  
  if (lower.includes('young')) conditions.push('age < "young"')
  if (lower.includes('good') || lower.includes('excellent')) conditions.push('performance is "good"')
  if (lower.includes('high') || lower.includes('talented')) conditions.push('potential is "high"')
  if (lower.includes('recent')) conditions.push('timeframe is "recent"')
  
  if (conditions.length === 0) {
    conditions.push('criteria meets "requirements"')
  }
  
  let domain = 'general'
  if (lower.includes('player') || lower.includes('soccer')) domain = 'soccer'
  if (lower.includes('stock') || lower.includes('trade')) domain = 'finance'
  if (lower.includes('hire') || lower.includes('developer')) domain = 'recruiting'
  
  return `@domain("${domain}")\n\nwhere ${conditions.join('\n  and ')}`
}

function toNatural(ndel: string): string {
  const lines = []
  
  if (ndel.includes('age < "young"')) lines.push('young individuals')
  if (ndel.includes('performance is "good"')) lines.push('with good performance')
  if (ndel.includes('potential is "high"')) lines.push('showing high potential')
  
  if (lines.length === 0) return 'Find items matching the specified criteria'
  
  return `Find ${lines.join(' ')}`
}

export async function POST(request: NextRequest) {
  const { input, isFlipped } = await request.json()
  
  let output = ''
  
  try {
    if (isFlipped) {
      output = toNatural(input)
    } else {
      output = toNDEL(input)
    }
  } catch (error) {
    output = isFlipped ?
      'Unable to translate NDEL expression' :
      '@domain("general")\n\nwhere error_occurred'
  }
  
  return NextResponse.json({ output })
}
