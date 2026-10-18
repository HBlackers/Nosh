type ErrorListProps = {
  messages: string[];
};

export function ErrorList({ messages }: ErrorListProps) {
  return (
    <ul role="alert" className="space-y-1 rounded-lg border border-destructive bg-card p-3 text-base">
      {messages.map(message => (
        <li key={message}>{message}</li>
      ))}
    </ul>
  );
}
