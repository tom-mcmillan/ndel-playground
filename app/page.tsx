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
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: isFlipped ? rightContent : leftContent })
      })
      
      const data = await response.json()
      setLeftContent(data.output)
    } catch (error) {
      // Basic fallback conversion
      const input = isFlipped ? rightContent : leftContent
      const output = `@domain("general")\n\nwhere criteria matches "${input.slice(0, 50)}..."`
      setLeftContent(output)
    }
    
    setIsLoading(false)
  }

  const runQuery = () => {
    alert('Run functionality coming soon!')
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
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Generating...' : 'Generate'}
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
