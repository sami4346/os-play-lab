import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const OSExpertBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial greeting
  useEffect(() => {
    setMessages([{
      role: 'assistant',
      content: '👋 Hello! I\'m your OS Learning Assistant. Ask me anything about Operating Systems!',
      timestamp: new Date()
    }]);
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Knowledge base for OS concepts
  const osKnowledgeBase: Record<string, string> = {
    'process': 'A **process** is a program in execution. It includes the program code and its current activity. Each process has its own memory space, file handles, and system resources.',
    'thread': 'A **thread** is the smallest unit of processing that can be performed in an OS. Threads within the same process share the same memory space but have their own program counters and stack.',
    'scheduling': '**CPU Scheduling** is the process of determining which process will use the CPU when multiple processes are ready to execute. Common algorithms include FCFS, Round Robin, and Priority Scheduling.',
    'paging': '**Paging** is a memory management scheme that eliminates the need for contiguous allocation of physical memory. It allows the physical address space of a process to be non-contiguous.',
    'segmentation': '**Segmentation** is a memory management technique that divides memory into segments of varying sizes. Each segment represents a logical unit like code, data, or stack.',
    'virtual memory': '**Virtual Memory** is a memory management technique that provides an idealized abstraction of the storage resources available on a machine.',
    'deadlock': 'A **deadlock** is a situation where a set of processes are blocked because each process is holding a resource and waiting for another resource acquired by some other process.',
    'synchronization': '**Synchronization** is the coordination of multiple processes or threads to ensure proper execution order and prevent race conditions.',
    'concurrency': '**Concurrency** is the ability of different parts or units of a program to be executed out-of-order or in partial order, without affecting the final outcome.',
  };

  const findBestMatch = async (query: string): Promise<string> => {
    // First try the HuggingFace API
    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: query }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }
      
      const data = await response.json();
      return data.response || "I'm sorry, I couldn't process your request at the moment.";
    } catch (error) {
      console.error('Error calling AI API:', error);
      
      // Fallback to local knowledge base if API call fails
      const queryLower = query.toLowerCase();
      for (const [key, value] of Object.entries(osKnowledgeBase)) {
        if (queryLower.includes(key)) {
          return value;
        }
      }
      
      // If no local match found, return a generic response
      return "I'm having trouble connecting to the AI service. Please try again later or ask about specific OS concepts like processes, threads, or memory management.";
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission from reloading the page
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Get response from AI
      const response = await findBestMatch(input);
      
      const aiMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const fallbackResponses = [
        "I'm not sure I understand. Could you rephrase your question about operating systems?",
        "That's an interesting question about operating systems! Could you provide more details?",
        "I specialize in operating system concepts. Could you ask me something about processes, memory management, or file systems?",
        "I'd be happy to help with OS concepts! Could you clarify your question?"
      ];
      
      const errorMessage: Message = {
        role: 'assistant',
        content: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatMessage = (content: string) => {
    // Simple markdown-like formatting for bold text
    return content.split('**').map((part, i) => 
      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
    );
  };

  return (
    <div className="flex flex-col h-[500px] max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-blue-600 text-white p-4">
        <h2 className="text-xl font-bold">OS Learning Assistant</h2>
        <p className="text-sm opacity-80">Ask me anything about Operating Systems</p>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
          >
            <div 
              className={`inline-block p-3 rounded-lg ${message.role === 'user' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-800'}`}
            >
              <div className="whitespace-pre-wrap">
                {formatMessage(message.content)}
              </div>
              <div className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2 p-3 bg-gray-100 rounded-lg max-w-max">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={(e) => handleSendMessage(e)} className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about operating systems..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Try asking about: processes, threads, memory management, or deadlocks
        </p>
      </form>
    </div>
  );
};

export default OSExpertBot;
