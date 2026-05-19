const express = require('express')
const path = require('path')

const app = express()
app.use(express.json())

const API_KEY = process.env.GEMINI_API_KEY
const MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash'

if (!API_KEY) {
  console.error('ERROR: GEMINI_API_KEY environment variable is not set')
  process.exit(1)
}

app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, model } = req.body
    const useModel = model || MODEL
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${useModel}:generateContent?key=${API_KEY}`

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 1024 },
      }),
    })

    const data = await response.json()
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'API error' })
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    res.json({ text })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/health', (_, res) => res.json({ ok: true, model: MODEL }))

app.use(express.static(path.join(__dirname, 'public')))
app.get('/{*path}', (_, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
