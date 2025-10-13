export default function HighlightLinks({ text, isOwn }) {
  const urlPattern = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;
  const parts = text.split(urlPattern);

  return (
    <>
      {parts.map((part, i) =>
        urlPattern.test(part) ? (
          <a
            key={i}
            href={part.startsWith("http") ? part : "http://" + part}
            target="_blank"
            className={`${
              isOwn ? "text-white underline" : "text-blue-600 underline"
            }`}
          >
            {part}
          </a>
        ) : (
          part
        )
      )}
    </>
  );
}
