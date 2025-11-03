import { NextRequest, NextResponse } from 'next/server'

function toNDEL(text: string): string {
  const lower = text.toLowerCase()
  const conditions: string[] = []

  // Determine domain
  let domain = 'general'
  if (lower.includes('player') || lower.includes('soccer') || lower.includes('striker') || lower.includes('goalkeeper')) {
    domain = 'soccer'
  } else if (lower.includes('stock') || lower.includes('trade') || lower.includes('volatility') || lower.includes('market')) {
    domain = 'finance'
  } else if (lower.includes('hire') || lower.includes('developer') || lower.includes('candidate') || lower.includes('engineer')) {
    domain = 'recruiting'
  } else if (lower.includes('customer') || lower.includes('purchase') || lower.includes('churn')) {
    domain = 'customer_analytics'
  } else if (lower.includes('property') || lower.includes('house') || lower.includes('real estate')) {
    domain = 'real_estate'
  } else if (lower.includes('article') || lower.includes('content') || lower.includes('publication')) {
    domain = 'content'
  }

  // Age / Time-based
  const ageMatch = text.match(/under (\d+)|less than (\d+)|< (\d+)/i)
  if (ageMatch) {
    const age = ageMatch[1] || ageMatch[2] || ageMatch[3]
    conditions.push(`age < ${age}`)
  } else if (lower.includes('young')) {
    conditions.push('age < 25')
  }

  // Position / Role
  if (lower.includes('striker') || lower.includes('forward')) {
    conditions.push('position in ["ST", "CF"]')
  }
  if (lower.includes('senior')) {
    conditions.push('seniority >= "senior"')
  }

  // Performance metrics
  const goalsMatch = text.match(/more than (\d+) goals?|> (\d+) goals?|(\d+)\+ goals?/i)
  if (goalsMatch) {
    const goals = goalsMatch[1] || goalsMatch[2] || goalsMatch[3]
    conditions.push(`goals > ${goals}`)
  }

  // Qualities
  if (lower.includes('high potential') || lower.includes('talented')) {
    conditions.push('potential is "high"')
  }
  if (lower.includes('good form') || lower.includes('recent form')) {
    conditions.push('recent_form shows "positive"')
  }
  if (lower.includes('good communication') || lower.includes('communication skills')) {
    conditions.push('communication_skills is "good"')
  }

  // Finance specific
  if (lower.includes('increased in value') || lower.includes('growth') || lower.includes('gains')) {
    conditions.push('price_trend is "upward"')
  }
  if (lower.includes('low volatility') || lower.includes('stable')) {
    conditions.push('volatility is "low"')
  }
  if (lower.includes('technology sector') || lower.includes('tech sector')) {
    conditions.push('sector is "technology"')
  }
  if (lower.includes('past quarter') || lower.includes('last quarter')) {
    conditions.push('timeframe is "last_quarter"')
  }

  // Customer analytics
  if (lower.includes('last 3 months') || lower.includes('past 3 months')) {
    conditions.push('last_purchase_date > "3_months_ago"')
  }
  if (lower.includes('not in the last week') || lower.includes('not recently')) {
    conditions.push('last_purchase_date < "1_week_ago"')
  }
  if (lower.includes('spend above average') || lower.includes('spend more than average')) {
    conditions.push('avg_purchase_value > "average"')
  }
  if (lower.includes('churn') || lower.includes('at risk')) {
    conditions.push('churn_risk is "high"')
  }

  // Skills
  if (lower.includes('python')) {
    conditions.push('skills.python is "strong"')
  }
  if (lower.includes('machine learning') || lower.includes('ml experience')) {
    conditions.push('experience.machine_learning is "proficient"')
  }
  if (lower.includes('mentor')) {
    conditions.push('mentoring_ability is "capable"')
  }
  if (lower.includes('compatible timezone') || lower.includes('timezone')) {
    conditions.push('timezone is "compatible"')
  }

  // Real estate
  const priceMatch = text.match(/under \$?([\d,]+)k?|less than \$?([\d,]+)k?|< \$?([\d,]+)k?/i)
  if (priceMatch) {
    const price = priceMatch[1] || priceMatch[2] || priceMatch[3]
    conditions.push(`price < ${price}`)
  }
  const bedroomsMatch = text.match(/(\d+)\+? bedrooms?|at least (\d+) bedrooms?/i)
  if (bedroomsMatch) {
    const beds = bedroomsMatch[1] || bedroomsMatch[2]
    conditions.push(`bedrooms >= ${beds}`)
  }
  if (lower.includes('school rating') || lower.includes('good schools')) {
    conditions.push('school_rating is "high"')
  }
  if (lower.includes('downtown') || lower.includes('city center')) {
    const minutesMatch = text.match(/(\d+) minutes?/i)
    if (minutesMatch) {
      conditions.push(`distance_to_downtown < ${minutesMatch[1]}_min`)
    }
  }

  // Content specific
  if (lower.includes('last week') || lower.includes('past week')) {
    conditions.push('published_date > "1_week_ago"')
  }
  if (lower.includes('high engagement')) {
    conditions.push('engagement_score is "high"')
  }
  if (lower.includes('credible') || lower.includes('trusted')) {
    conditions.push('source_credibility is "high"')
  }
  if (lower.includes('artificial intelligence') || lower.includes('ai')) {
    conditions.push('topic is "artificial_intelligence"')
  }

  // Fallback
  if (conditions.length === 0) {
    conditions.push('criteria meets "requirements"')
  }

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
