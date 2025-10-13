import { useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { $getRoot } from "lexical";
import { MentionNode, $isMentionNode } from "../nodes/MentionNode";
import { HashtagNode, $isHashtagNode } from "../nodes/HashtagNode";
import { MentionHashtagPlugin } from "../plugins/MentionHashtagPlugin";
import { AutocompletePlugin } from "../plugins/AutocompletePlugin";
import { Code } from "lucide-react";

const theme = {
  paragraph: "mb-1",
  text: {
    bold: "font-bold",
  },
};

function onError(error) {
  console.error(error);
}

export function LexicalEditor({
  setMentionedUid,
  setContentArray,
  setHashtags,
}) {
  const [jsonOutput, setJsonOutput] = useState([]);
  const [showJson, setShowJson] = useState(false);

  const initialConfig = {
    namespace: "MentionHashtagEditor",
    theme,
    onError,
    nodes: [MentionNode, HashtagNode],
  };

  function onChange(editorState) {
    editorState.read(() => {
      const root = $getRoot();
      const parsed = [];

      root.getChildren().forEach((paragraph) => {
        paragraph.getChildren().forEach((node) => {
          if ($isMentionNode(node)) {
            const text = node.getTextContent();
            parsed.push({ type: "mention", value: text.substring(1) });
          } else if ($isHashtagNode(node)) {
            const text = node.getTextContent();
            parsed.push({ type: "hashtag", value: text.substring(1) });
          } else {
            const text = node.getTextContent();
            if (text) {
              parsed.push({ type: "text", value: text });
            }
          }
        });
      });

      setJsonOutput(parsed);
      setContentArray(parsed);
    });
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="space-y-4 w-full h-full ">
        <div className="relative border-2 border-gray-300 rounded-lg bg-white shadow-sm">
          <PlainTextPlugin
            contentEditable={
              <ContentEditable className="min-h-[150px] p-4 outline-none" />
            }
            placeholder={
              <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
                Type @ for mentions or # for hashtags...
              </div>
            }
          />
          <HistoryPlugin />
          <OnChangePlugin onChange={onChange} />
          <MentionHashtagPlugin />
          <AutocompletePlugin
            setMentionedUid={setMentionedUid}
            setHashtags={setHashtags}
          />
        </div>

        <button
          onClick={() => setShowJson(!showJson)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Code size={18} />
          {showJson ? "Hide" : "Show"} JSON Output
        </button>

        {showJson && (
          <div className="bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm font-mono">
              {JSON.stringify(jsonOutput, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </LexicalComposer>
  );
}
