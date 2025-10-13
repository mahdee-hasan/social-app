import React from "react";

function replaceMentions(text, people) {
  const regex = /__USER\[([^\]]+)\]__/g;
  const elements = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const [fullMatch, oid] = match;

    // push text before the mention
    if (match.index > lastIndex) {
      elements.push(text.slice(lastIndex, match.index));
    }

    // find person by oid
    const person = people.find((p) => p.oid === oid);

    if (person) {
      elements.push(
        <span
          key={oid + match.index}
          className="bg-yellow-200 font-semibold px-1 rounded"
        >
          {person.name}
        </span>
      );
    } else {
      // if oid not found, just keep the original pattern
      elements.push(fullMatch);
    }

    lastIndex = match.index + fullMatch.length;
  }

  // push any remaining text after last match
  if (lastIndex < text.length) {
    elements.push(text.slice(lastIndex));
  }

  return <>{elements}</>;
}

export default replaceMentions;
