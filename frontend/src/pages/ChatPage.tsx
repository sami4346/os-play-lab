import OSExpertBot from '@/components/chat/OSChat';

const ChatPage = () => {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center text-foreground mb-2">
          OS Learning Assistant
        </h1>
        <p className="text-center text-muted-foreground mb-6">
          Ask me anything about Operating Systems! I can help with processes, memory management, file systems, and more.
        </p>
        <div className="rounded-2xl border border-border bg-card shadow-sm p-3 sm:p-4">
          <OSExpertBot />
        </div>
        
        <div className="mt-8 rounded-2xl border border-border bg-card shadow-sm p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Example Questions</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <ExampleQuestion text="What is virtual memory?" />
            <ExampleQuestion text="Explain process scheduling" />
            <ExampleQuestion text="What is a deadlock?" />
            <ExampleQuestion text="How does paging work?" />
          </ul>
        </div>
      </div>
    </div>
  );
};

type ExampleQuestionProps = {
  text: string;
};

const ExampleQuestion = ({ text }: ExampleQuestionProps) => (
  <li
    className="bg-muted text-foreground/90 hover:text-foreground p-3 rounded-lg border border-border/80 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-colors"
    onClick={() => window.location.href = `/chat?q=${encodeURIComponent(text)}`}
  >
    {text}
  </li>
);

export default ChatPage;
