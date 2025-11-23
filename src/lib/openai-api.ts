import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface OpenAIChatOptions {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
}

export async function openaiChatCompletion(opts: OpenAIChatOptions) {
  try {
    // Use the actual OpenAI API
    const response = await openai.chat.completions.create({
      model: opts.model || 'gpt-4o',
      messages: opts.messages,
      temperature: opts.temperature || 0.7,
      max_tokens: opts.max_tokens || 500,
    });

    return response;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    // Fallback to mock response if API fails
    const userMessage = opts.messages[opts.messages.length - 1]?.content || 'Hello';
    return {
      choices: [
        {
          message: {
            content: `I'm having some technical difficulties right now, but I'm here for you both. Let me try to help: Based on what you said about "${userMessage}", I'd suggest focusing on open communication and understanding each other's perspectives.`
          }
        }
      ]
    };
  }
}

export async function generateEmbedding(text: string) {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    
    return response.data[0].embedding;
  } catch (error) {
    console.error('OpenAI Embedding Error:', error);
    return [];
  }
}
