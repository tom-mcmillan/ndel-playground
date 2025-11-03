'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

export default function Home() {
  const [leftContent, setLeftContent] = useState('')
  const [rightContent, setRightContent] = useState('')
  const [copied, setCopied] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const generateNDEL = async () => {
    setIsLoading(true)

    // Generate random example input for the left box
    const examples = [
      "Find me a young soccer player under 23 who plays as a striker, has scored more than 10 goals this season, and shows high potential for development.",
      "I need customers who made purchases in the last 3 months but not recently, spend above average, and might be at risk of churning.",
      "Looking for a senior Python developer with machine learning experience, good communication skills, able to mentor juniors, and in a compatible timezone.",
      "Find stocks that have increased in value over the past quarter, have low volatility, and are in the technology sector.",
      "I want to find articles published in the last week about artificial intelligence that have high engagement and are from credible sources.",
      "Show me properties for sale under $500k, with at least 3 bedrooms, good school ratings, and within 30 minutes of downtown."
    ]

    const randomExample = examples[Math.floor(Math.random() * examples.length)]
    setLeftContent(randomExample)

    setIsLoading(false)
  }

  const runQuery = async () => {
    if (!leftContent.trim()) return

    setIsLoading(true)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: leftContent, isFlipped })
      })

      const data = await response.json()
      setRightContent(data.output)
    } catch (error) {
      // Basic fallback conversion
      const output = `@domain("general")\n\nwhere criteria matches "${leftContent.slice(0, 50)}..."`
      setRightContent(output)
    }

    setIsLoading(false)
  }

  const swapBoxes = () => {
    // Just swap the labels, not the content
    setIsFlipped(!isFlipped)
  }

  const copyToClipboard = async () => {
    const contentToCopy = isFlipped ? leftContent : rightContent
    await navigator.clipboard.writeText(contentToCopy)
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

          <div className="flex justify-center mb-6">
            <button
              onClick={generateNDEL}
              disabled={isLoading}
              className="group relative px-10 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-md overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    Generate Example
                    <span className="text-2xl group-hover:translate-x-1 transition-transform">✨</span>
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                <h3 className="font-semibold text-gray-700">
                  {isFlipped ? 'NDEL Expression' : 'Natural Language'}
                </h3>
                <button
                  onClick={runQuery}
                  className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                >
                  Run
                </button>
              </div>
              <textarea
                value={leftContent}
                onChange={(e) => setLeftContent(e.target.value)}
                placeholder=""
                className="w-full p-4 h-96 resize-none focus:outline-none font-mono text-sm"
                spellCheck={false}
              />
            </motion.div>

            <button
              onClick={swapBoxes}
              className="px-4 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-xl hover:bg-gray-50 transform hover:scale-105 transition-all"
              title="Swap boxes"
            >
              ⇄
            </button>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                <h3 className="font-semibold text-gray-700">
                  {isFlipped ? 'Natural Language' : 'NDEL Expression'}
                </h3>
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
                  defaultLanguage="text"
                  value={rightContent}
                  onChange={(value) => setRightContent(value || '')}
                  theme="vs-light"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    padding: { top: 16, bottom: 16 },
                    wordWrap: 'on',
                    wrappingIndent: 'none',
                    scrollBeyondLastLine: false,
                    renderLineHighlight: 'none',
                    occurrencesHighlight: 'off',
                    selectionHighlight: false
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
