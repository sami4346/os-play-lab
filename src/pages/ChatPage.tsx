import OSExpertBot from '@/components/chat/OSChat';

const ChatPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          OS Learning Assistant
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Ask me anything about Operating Systems! I can help with processes, memory management, file systems, and more.
        </p>
        <OSExpertBot />
        
        <div className="mt-12 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Example Questions:</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <li className="bg-gray-50 p-3 rounded hover:bg-gray-100 cursor-pointer" 
                onClick={() => window.location.href = '/chat?q=What is virtual memory?'}>
              What is virtual memory?
            </li>
            <li className="bg-gray-50 p-3 rounded hover:bg-gray-100 cursor-pointer"
                onClick={() => window.location.href = '/chat?q=Explain process scheduling'}>
              Explain process scheduling
            </li>
            <li className="bg-gray-50 p-3 rounded hover:bg-gray-100 cursor-pointer"
                onClick={() => window.location.href = '/chat?q=What is a deadlock?'}>
              What is a deadlock?
            </li>
            <li className="bg-gray-50 p-3 rounded hover:bg-gray-100 cursor-pointer"
                onClick={() => window.location.href = '/chat?q=How does paging work?'}>
              How does paging work?
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
