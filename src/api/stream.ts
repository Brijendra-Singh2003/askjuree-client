export const sendMessage = async (
    messages: Array<{ role: "user" | "assistant", content: string }>, 
    onData: (data: string) => void,
    onComplete: () => void
) => {
    try {
        const response = await fetch('http://localhost:8000/api/stream', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                messages: messages 
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
            throw new Error('No response body');
        }

        while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
                onComplete();
                break;
            }

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data.trim() && data !== '[DONE]') {
                        onData(data);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};