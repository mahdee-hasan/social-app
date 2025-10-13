import React from "react";

const highlightText = (text, query) => {
  if (!query) return text;

  const regex = new RegExp(`(${query})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={i} className="text-green-500 font-bold">
        {part}
      </span>
    ) : (
      part
    )
  );
};

export default highlightText;
