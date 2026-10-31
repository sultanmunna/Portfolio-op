export function Roll({ text }: { text: string }) {
  return (
    <span className="roll">
      <span aria-hidden="true">{text}</span>
      <span aria-hidden="true">{text}</span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
