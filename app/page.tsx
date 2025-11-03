'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

const EXAMPLES = {
  soccer: {
    input: `I'm looking for a soccer player who's still pretty young, maybe under 23 or so, who plays as a striker or center forward, and has been showing really good form recently. They should be scoring decent goals, let's say more than 10 this season, but also not be too expensive for our budget which is limited. Ideally someone with high potential who could grow with the team.`,
    output: `@domain("soccer")

where player is "young striker"
  and age < 23
  and position in ["ST", "CF"]
  and recent_form shows "good trend"
  and goals > 10
  and transfer_value is "within budget"
  and potential is "high"
  and development_trajectory shows "positive"`
  },
  data: {
    input: `Find me all the customers from our database who have made purchases in the last 3 months but not in the last week, who typically spend more than average, and seem like they might be at risk of churning based on their behavior patterns.`,
    output: `@domain("customer_analytics")

where customer.last_purchase > "3 months ago"
  and customer.last_purchase < "1 week ago"  
  and customer.avg_purchase_value > "above average"
  and customer.behavior shows "churn risk pattern"
  and customer.engagement is "declining"`
  },
  hiring: {
    input: `We need a senior developer with strong Python skills, preferably someone who has worked with machine learning but doesn't need to be an expert. They should have good communication skills and be able to mentor junior developers. Remote is fine but they should be in a compatible timezone.`,
    output: `@domain("recruiting")

where candidate is "senior developer"
  and skills.python is "strong"
  and experience.machine_learning is "familiar"
  and soft_skills.communication is "good"
  and soft_skills.mentoring is "capable"
  and location.timezone is "compatible"
  and seniority >= "senior"`
  }
}

export default function Home() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)
  const [currentExample, setCurrentExample] = useState<string | null>(null)

  const loadExample = (key: keyof typeof EXAMPLES) => {
    setInput(EXAMPLES[key].input)
    setOutput(EXAMPLES[key].output)
    setCurrentExample(key)
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              NDEL
            </span>
            <a 
              href="https://github.com/yourusername/ndel" 
              className="text-gray-600 hover:text-gray-900"
            >
              GitHub
            </a>
          </div>
        </div>
      </nav>

      <section className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Turn <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">rambling queries</span> into
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">precise expressions</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              NDEL converts natural language into efficient expressions.
              Get better LLM responses with fewer tokens.
            </p>
          </motion.div>

          <div className="flex justify-center gap-3 mb-8">
            <button
              onClick={() => loadExample('soccer')}
              className={`px-4 py-2 rounded-full transition-colors ${
                currentExample === 'soccer' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              Soccer Scout
            </button>
            <button
              onClick={() => loadExample('data')}
              className={`px-4 py-2 rounded-full transition-colors ${
                currentExample === 'data' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              Data Analysis
            </button>
            <button
              onClick={() => loadExample('hiring')}
              className={`px-4 py-2 rounded-full transition-colors ${
                currentExample === 'hiring' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
              }`}
            >
              Hiring
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="bg-gray-50 px-4 py-3 border-b">
                <h3 className="font-semibold text-gray-700">Natural Language</h3>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your ChatGPT prompt here..."
                className="w-full p-4 h-96 resize-none focus:outline-none font-mono text-sm"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                <h3 className="font-semibold text-gray-700">NDEL Expression</h3>
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-1 bg-black text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="h-96 overflow-auto">
                <Editor
                  height="100%"
                  defaultLanguage="javascript"
                  value={output}
                  onChange={(value) => setOutput(value || '')}
                  theme="vs-light"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    padding: { top: 16, bottom: 16 }
                  }}
                />
              </div>
            </motion.div>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>💡 Tip: You can use any domain with @domain("your_domain_here")</p>
          </div>
        </div>
      </section>
    </div>
  )
}
