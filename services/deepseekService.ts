// DeepSeek API客户端（通过安全代理）
let chatHistory: Array<{role: string, content: string}> = [];

export const initDeepSeekSession = () => {
  chatHistory = [{
    role: 'system',
    content: "You are 'DeepForge', an advanced AI assistant. Your tone is professional, concise, and helpful. You are knowledgeable about software engineering, AI technology, and data science."
  }];
};

export const sendDeepSeekMessageStream = async function* (message: string) {
  // 输入验证
  if (!message || message.trim().length === 0) {
    throw new Error("Message cannot be empty");
  }

  if (message.length > 2000) {
    throw new Error("Message too long. Maximum 2000 characters.");
  }

  chatHistory.push({ role: 'user', content: message });

  try {
    // 开发环境和生产环境统一调用
    const isDev = import.meta.env.DEV;
    const url = isDev
      ? '/api/deepseek'  // 开发环境通过Vite代理
      : '/api/chat';     // 生产环境通过Vercel Edge Function

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        history: chatHistory
      })
    });

    // 处理限流错误
    if (response.status === 429) {
      const error = await response.json();
      throw new Error(error.error || 'Rate limit reached. Please try again in an hour.');
    }

    // 处理其他错误
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Service temporarily unavailable' }));
      throw new Error(error.error || `API error: ${response.status}`);
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const lines = decoder.decode(value).split('\n').filter(l => l.startsWith('data: '));

      for (const line of lines) {
        const data = line.slice(6);
        if (data === '[DONE]') continue;

        try {
          const content = JSON.parse(data).choices[0]?.delta?.content;
          if (content) {
            fullResponse += content;
            yield content;
          }
        } catch {}
      }
    }

    chatHistory.push({ role: 'assistant', content: fullResponse });
  } catch (error) {
    // 发生错误时从历史中移除用户消息
    chatHistory.pop();
    throw error;
  }
};
