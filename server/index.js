const express = require('express')
const path = require('path')

const app = express()
app.use(express.json())

const API_KEY = process.env.CLAUDE_API_KEY
const MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-4-6'

if (!API_KEY) {
  console.error('ERROR: CLAUDE_API_KEY environment variable is not set')
  process.exit(1)
}

app.post('/api/generate', async (req, res) => {
  try {
    const { messages, model, max_tokens = 1024 } = req.body
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({ model: model || MODEL, max_tokens, messages }),
    })
    const data = await response.json()
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'API error' })
    }
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/health', (_, res) => res.json({ ok: true, model: MODEL }))

// 托管前端静态文件
app.use(express.static(path.join(__dirname, 'public')))
app.get('/{*path}', (_, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
