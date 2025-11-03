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
  }
}

export default function Home() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [domain, setDomain] = useState('general')
  const [copied, setCopied] = useState(false)

  const loadExample = () => {
    setInput(EXAMPLES.soccer.input)
    setOutput(EXAMPLES.soccer.output)
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
              onClick={loadExample}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
            >
              Load Example
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                <h3 className="font-semibold text-gray-700">Natural Language</h3>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="px-3 py-1 border rounded-lg text-sm"
                >
                  <option value="general">General</option>
                  <option value="soccer">Soccer</option>
                  <option value="finance">Finance</option>
                  <option value="healthcare">Healthcare</option>
                </select>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your ChatGPT prompt here..."
                className="w-full p-4 h-96 resize-none focus:outline-none"
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
        </div>
      </section>
    </div>
  )
}
