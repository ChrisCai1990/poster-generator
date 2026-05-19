const express = require('express')
const path = require('path')

const app = express()
app.use(express.json())

const API_KEY = process.env.DASHSCOPE_API_KEY
const MODEL = process.env.QWEN_MODEL || 'qwen-plus'

if (!API_KEY) {
  console.error('ERROR: DASHSCOPE_API_KEY environment variable is not set')
  process.exit(1)
}

app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, model } = req.body
    const useModel = model || MODEL

    const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: useModel,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1024,
      }),
    })

    const data = await response.json()
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'API error' })
    }

    const text = data.choices?.[0]?.message?.content ?? ''
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
