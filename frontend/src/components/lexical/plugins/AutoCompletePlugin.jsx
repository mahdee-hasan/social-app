import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useState, useCallback } from "react";
import {
  $getSelection,
  $isRangeSelection,
  TextNode,
  COMMAND_PRIORITY_LOW,
  KEY_ARROW_DOWN_COMMAND,
  KEY_ARROW_UP_COMMAND,
  KEY_ENTER_COMMAND,
  KEY_ESCAPE_COMMAND,
} from "lexical";
import { AutocompleteMenu } from "../components/AutocompleteMenu";
import { mockHashtags } from "../data/mockData";
import { $createMentionNode } from "../nodes/MentionNode";
import { $createHashtagNode } from "../nodes/HashtagNode";
import getFriends from "@/services/getFriends";

export function AutocompletePlugin({ setMentionedUid, setHashtags }) {
  const [editor] = useLexicalComposerContext();
  const [autocomplete, setAutocomplete] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [users, setUsers] = useState([]);

  const getMentionableUser = async () => {
    const res = await getFriends();
    if (res.success) {
      setUsers(res.friends);
    }
  };

  useEffect(() => {
    getMentionableUser();
  }, []);
  const getFilteredItems = useCallback(() => {
    if (!autocomplete) return [];

    const query = autocomplete.query.toLowerCase();

    if (autocomplete.type === "mention") {
      return users.filter((user) => user.name.toLowerCase().includes(query));
    } else {
      return mockHashtags.filter((hashtag) =>
        hashtag.value.toLowerCase().includes(query)
      );
    }
  }, [autocomplete]);

  const filteredItems = getFilteredItems();

  const closeAutocomplete = useCallback(() => {
    setAutocomplete(null);
    setSelectedIndex(0);
  }, []);

  const insertItem = useCallback(
    (item) => {
      if (!autocomplete) return;
      autocomplete.type === "mention"
        ? setMentionedUid((prev) => [...prev, item._id])
        : setHashtags((prev) => [...prev, item.value]);

      editor.update(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;

        const anchor = selection.anchor;
        const node = anchor.getNode();

        if (
          node instanceof TextNode &&
          node.getKey() === autocomplete.nodeKey
        ) {
          const text = node.getTextContent();
          const beforeTrigger = text.slice(0, autocomplete.triggerOffset);
          const afterQuery = text.slice(anchor.offset);

          const mentionText =
            autocomplete.type === "mention"
              ? `@${item.name}`
              : `#${item.value}`;

          if (beforeTrigger.length > 0) {
            const beforeNode = new TextNode(beforeTrigger);
            node.replace(beforeNode);

            const mentionNode =
              autocomplete.type === "mention"
                ? $createMentionNode(mentionText)
                : $createHashtagNode(mentionText);

            beforeNode.insertAfter(mentionNode);

            const afterNode = new TextNode(" " + afterQuery);
            mentionNode.insertAfter(afterNode);
            afterNode.select(1, 1);
          } else {
            const mentionNode =
              autocomplete.type === "mention"
                ? $createMentionNode(mentionText)
                : $createHashtagNode(mentionText);

            node.replace(mentionNode);

            const afterNode = new TextNode(" " + afterQuery);
            mentionNode.insertAfter(afterNode);
            afterNode.select(1, 1);
          }
        }
      });

      closeAutocomplete();
    },
    [editor, autocomplete, closeAutocomplete]
  );

  useEffect(() => {
    const updateAutocomplete = () => {
      editor.getEditorState().read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          setAutocomplete(null);
          return;
        }

        const anchor = selection.anchor;
        const node = anchor.getNode();

        if (!(node instanceof TextNode)) {
          setAutocomplete(null);
          return;
        }

        const text = node.getTextContent();
        const offset = anchor.offset;
        const textBeforeCursor = text.slice(0, offset);

        const lastAtIndex = textBeforeCursor.lastIndexOf("@");
        const lastHashIndex = textBeforeCursor.lastIndexOf("#");
        const lastSpaceIndex = Math.max(
          textBeforeCursor.lastIndexOf(" "),
          textBeforeCursor.lastIndexOf("\n"),
          -1
        );

        let triggerIndex = -1;
        let type = null;

        if (lastAtIndex > lastSpaceIndex && lastAtIndex > lastHashIndex) {
          triggerIndex = lastAtIndex;
          type = "mention";
        } else if (
          lastHashIndex > lastSpaceIndex &&
          lastHashIndex > lastAtIndex
        ) {
          triggerIndex = lastHashIndex;
          type = "hashtag";
        }

        if (triggerIndex === -1 || type === null) {
          setAutocomplete(null);
          return;
        }

        const query = textBeforeCursor.slice(triggerIndex + 1);

        const domSelection = window.getSelection();
        if (!domSelection || domSelection.rangeCount === 0) {
          setAutocomplete(null);
          return;
        }

        const range = domSelection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        setAutocomplete({
          type,
          query,
          position: {
            top: rect.bottom + window.scrollY + 4,
            left: rect.left + window.scrollX,
          },
          triggerOffset: triggerIndex,
          nodeKey: node.getKey(),
        });
        setSelectedIndex(0);
      });
    };

    return editor.registerUpdateListener(() => {
      updateAutocomplete();
    });
  }, [editor]);

  useEffect(() => {
    if (!autocomplete) return;

    const handleArrowDown = () => {
      setSelectedIndex((prev) =>
        prev < filteredItems.length - 1 ? prev + 1 : prev
      );
      return true;
    };

    const handleArrowUp = () => {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      return true;
    };

    const handleEnter = () => {
      if (filteredItems[selectedIndex]) {
        insertItem(filteredItems[selectedIndex]);
        return true;
      }
      return false;
    };

    const handleEscape = () => {
      closeAutocomplete();
      return true;
    };

    const removeArrowDown = editor.registerCommand(
      KEY_ARROW_DOWN_COMMAND,
      handleArrowDown,
      COMMAND_PRIORITY_LOW
    );

    const removeArrowUp = editor.registerCommand(
      KEY_ARROW_UP_COMMAND,
      handleArrowUp,
      COMMAND_PRIORITY_LOW
    );

    const removeEnter = editor.registerCommand(
      KEY_ENTER_COMMAND,
      handleEnter,
      COMMAND_PRIORITY_LOW
    );

    const removeEscape = editor.registerCommand(
      KEY_ESCAPE_COMMAND,
      handleEscape,
      COMMAND_PRIORITY_LOW
    );

    return () => {
      removeArrowDown();
      removeArrowUp();
      removeEnter();
      removeEscape();
    };
  }, [
    editor,
    autocomplete,
    filteredItems,
    selectedIndex,
    insertItem,
    closeAutocomplete,
  ]);

  if (!autocomplete || filteredItems.length === 0) {
    return null;
  }

  return (
    <AutocompleteMenu
      type={autocomplete.type}
      items={filteredItems}
      position={autocomplete.position}
      selectedIndex={selectedIndex}
      onSelect={insertItem}
      onClose={closeAutocomplete}
    />
  );
}
