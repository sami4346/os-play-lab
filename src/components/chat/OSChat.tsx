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
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial greeting and connection check
  useEffect(() => {
    setMessages([{
      role: 'assistant',
      content: '👋 Hello! I\'m your OS Learning Assistant. Ask me anything about Operating Systems!',
      timestamp: new Date()
    }]);
    
    // Check backend connection
    checkBackendConnection();
  }, []);

  // Check if backend is reachable
  const checkBackendConnection = async () => {
    try {
      console.log('Checking backend connection...');
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: 'connection test' })
      });
      
      if (response.ok) {
        console.log('✓ Backend connected');
        setConnectionStatus('connected');
      } else {
        console.error('✗ Backend responded with error:', response.status);
        setConnectionStatus('disconnected');
      }
    } catch (error) {
      console.error('✗ Cannot connect to backend:', error);
      setConnectionStatus('disconnected');
    }
  };

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Enhanced knowledge base for OS concepts
  const osKnowledgeBase: Record<string, string> = {
    'process': 'A **process** is a program in execution. It includes the program code and its current activity. Each process has its own memory space, file handles, and system resources. Processes are isolated from each other and communicate through inter-process communication (IPC) mechanisms.',
    
    'thread': 'A **thread** is the smallest unit of processing that can be performed in an OS. Threads within the same process share the same memory space but have their own program counters and stack. Threads enable concurrent execution within a single process, improving application responsiveness and resource utilization.',
    
    'scheduling': `**CPU Scheduling** is the process of determining which process will use the CPU when multiple processes are ready to execute. Common algorithms include:
    - **FCFS (First-Come, First-Served)**: Processes are executed in the order they arrive
    - **SJF (Shortest Job First)**: The process with the smallest execution time is selected next
    - **Priority Scheduling**: Processes are executed based on priority
    - **Round Robin**: Each process gets a small unit of CPU time (time quantum)
    - **Multilevel Queue**: Multiple ready queues with different priorities`,
    
    'paging': `**Paging** is a memory management scheme that eliminates the need for contiguous allocation of physical memory. Key points:
    - Divides physical memory into fixed-size blocks called frames
    - Divides logical memory into blocks of the same size called pages
    - Uses a page table to translate logical addresses to physical addresses
    - Reduces external fragmentation but can lead to internal fragmentation`,
    
    'segmentation': `**Segmentation** is a memory management technique that divides memory into segments of varying sizes. Each segment represents a logical unit like code, data, or stack. Unlike paging, segments can vary in size and represent logical divisions of a program. Segmentation provides a more natural view of memory for programmers but can lead to external fragmentation.`,
    
    'virtual memory': `**Virtual Memory** is a memory management technique that provides an idealized abstraction of the storage resources available on a machine. Key aspects:
    - Allows execution of processes that may not be completely in memory
    - Provides the illusion of a very large memory
    - Uses demand paging to load pages only when needed
    - Implements page replacement algorithms (LRU, FIFO, etc.) to manage memory`,
    
    'deadlock': `A **deadlock** is a situation where a set of processes are blocked because each process is holding a resource and waiting for another resource acquired by some other process. The four necessary conditions for deadlock are:
    1. Mutual Exclusion
    2. Hold and Wait
    3. No Preemption
    4. Circular Wait
    
    Deadlocks can be prevented by ensuring that at least one of these conditions cannot hold.`,
    
    'synchronization': `**Synchronization** is the coordination of multiple processes or threads to ensure proper execution order and prevent race conditions. Common synchronization mechanisms include:
    - **Mutex Locks**: Ensure only one thread can access a resource
    - **Semaphores**: Counter-based synchronization primitive
    - **Monitors**: High-level synchronization construct
    - **Condition Variables**: Allow threads to wait for certain conditions`,
    
    'concurrency': `**Concurrency** is the ability of different parts or units of a program to be executed out-of-order or in partial order, without affecting the final outcome. Key concepts:
    - Race conditions
    - Critical sections
    - Atomic operations
    - Memory consistency models
    - Parallelism vs Concurrency`,
    
    // New entries
    'file system': `A **file system** is a method for storing and organizing computer files and the data they contain. Key components:
    - File attributes and operations
    - Directory structure
    - File allocation methods (contiguous, linked, indexed)
    - Free space management`,
    
    'process synchronization': `**Process Synchronization** deals with techniques to coordinate the execution of multiple processes. Key concepts:
    - Critical Section Problem
    - Peterson's Solution
    - Semaphores and their implementation
    - Classical synchronization problems (Dining Philosophers, Readers-Writers, Producer-Consumer)`,
    
    'memory management': `**Memory Management** involves managing the computer's primary memory. Key aspects:
    - Memory allocation strategies
    - Swapping
    - Memory protection
    - Memory fragmentation
    - Memory-mapped files`,
    
    'disk scheduling': `**Disk Scheduling** algorithms determine the order in which disk I/O requests are processed. Common algorithms:
    - FCFS (First-Come, First-Served)
    - SSTF (Shortest Seek Time First)
    - SCAN (Elevator Algorithm)
    - C-SCAN (Circular SCAN)
    - LOOK and C-LOOK`,
    
    'cpu scheduling': `**CPU Scheduling** is the basis of multi-programmed operating systems. Key metrics:
    - CPU utilization
    - Throughput
    - Turnaround time
    - Waiting time
    - Response time
    
    Scheduling can be preemptive or non-preemptive.`,
    
    'interprocess communication': `**Interprocess Communication (IPC)** mechanisms allow processes to communicate and synchronize their actions. Common methods:
    - Shared Memory
    - Message Passing
    - Pipes
    - Message Queues
    - Sockets
    - Remote Procedure Calls (RPC)`,
    
    'os security': `**OS Security** involves protecting the OS from threats. Key aspects:
    - Authentication
    - Access Control
    - Cryptography
    - Intrusion Detection
    - Malware Protection
    - Security Policies`,
  }; 

  const findBestMatch = async (query: string): Promise<string> => {
    console.log(`[API Call] Sending message: "${query}"`);
    console.log('[API Call] URL: http://localhost:5000/api/chat');
    
    try {
      const requestBody = { message: query };
      console.log('[API Call] Request body:', JSON.stringify(requestBody));
      
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      console.log(`[API Call] Response status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[API Call] Error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('[API Call] Response data:', data);
      
      if (data.response) {
        console.log('[API Call] ✓ Got response from backend');
        return data.response;
      } else {
        console.warn('[API Call] No response field in data');
        throw new Error('No response field in data');
      }
      
    } catch (error) {
      console.error('[API Call] ✗ Error calling backend:', error);
      
      // Fallback to local knowledge base if API call fails
      console.log('[Fallback] Checking local knowledge base...');
      const queryLower = query.toLowerCase();
      for (const [key, value] of Object.entries(osKnowledgeBase)) {
        if (queryLower.includes(key)) {
          console.log(`[Fallback] ✓ Found match for "${key}"`);
          return value;
        }
      }
      
      console.log('[Fallback] No match found in knowledge base');
      return `I'm having trouble connecting to the AI service. The backend might not be running. Please make sure:\n\n1. Backend server is running on port 5000\n2. Run: cd backend && python api.py\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    console.log('='.repeat(50));
    console.log('[Chat] User sent message:', input);

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
      
      console.log('[Chat] Got response, length:', response.length);
      
      const aiMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      console.log('[Chat] ✓ Message added to chat');
    } catch (error) {
      console.error('[Chat] ✗ Fatal error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      console.log('='.repeat(50));
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
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">OS Learning Assistant</h2>
            <p className="text-sm opacity-80">Ask me anything about Operating Systems</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-400' : 
              connectionStatus === 'disconnected' ? 'bg-red-400' : 
              'bg-yellow-400'
            }`}></div>
            <span className="text-xs">
              {connectionStatus === 'connected' ? 'Connected' : 
               connectionStatus === 'disconnected' ? 'Disconnected' : 
               'Connecting...'}
            </span>
          </div>
        </div>
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
      
      <div className="border-t p-4 bg-white">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me about operating systems..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-2">
          Try asking about: processes, threads, memory management, or deadlocks
        </p>
        {connectionStatus === 'disconnected' && (
          <p className="text-xs text-red-500 mt-1">
            ⚠️ Backend not connected. Make sure to run: <code>cd backend && python api.py</code>
          </p>
        )}
      </div>
    </div>
  );
};

export default OSExpertBot;
