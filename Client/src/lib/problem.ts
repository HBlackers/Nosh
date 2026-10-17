export function problemMessages(error: unknown): string[] {
  if (typeof error === "object" && error !== null) {
    const { errors, detail, title } = error as { errors?: Record<string, string[]>; detail?: string | null; title?: string | null };
    const messages = Object.values(errors ?? {}).flat();
    if (messages.length > 0) {
      return messages;
    }
    if (title) {
      return [title];
    }
    if (detail) {
      return [detail];
    }
  }
  return ["Something went wrong. Please try again."];
}
