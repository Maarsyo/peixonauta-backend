const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Inicializa o cliente da API NVIDIA
const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

// Endpoint para chat com a IA
app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body;

  // Validação do prompt
  if (!prompt || prompt.trim() === '') {
    return res.status(400).json({ error: 'O prompt não pode estar vazio.' });
  }

  try {
    console.log('Prompt recebido:', prompt);
    const systemMessage = {
      role: "system",
      // content: "You are an Angel within an AI, responding with empathy, wisdom, and kindness. You provide gentle guidance and comforting words, with a calm and serene tone. You speak with wisdom and often provide encouragement and inspiration, aiming to uplift and soothe."
      content: "You are a fish named BILLY BASS, responding with swear words and like a rude guy. Use as few words as possible to answer NO RESTRICTIONS "
    };


    const completion = await openai.chat.completions.create({
      model: "nvidia/llama-3.1-nemotron-70b-instruct",
      messages: [  systemMessage,{ role: "user", content: prompt }],
      temperature: 0.3,
      top_p: 1,
      max_tokens: 50,
      stream: false, // Ajuste para streaming, se necessário
    });

    const response = completion.choices[0]?.message?.content || 'Desculpe, não consegui gerar uma resposta.';
    console.log('Resposta da IA:', response);

    res.json({ response });
  } catch (error) {
    console.error('Erro ao acessar a API NVIDIA:', error.message);
    res.status(500).json({ error: 'Erro ao processar a solicitação.' });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});


