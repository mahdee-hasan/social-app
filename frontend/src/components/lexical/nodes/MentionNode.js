import { TextNode } from "lexical";

export class MentionNode extends TextNode {
  static getType() {
    return "mention";
  }

  static clone(node) {
    return new MentionNode(node.__text, node.__key);
  }

  static importJSON(serializedNode) {
    const node = $createMentionNode(serializedNode.text);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }

  exportJSON() {
    return {
      ...super.exportJSON(),
      type: "mention",
    };
  }

  createDOM() {
    const dom = document.createElement("span");
    dom.style.fontWeight = "bold";
    dom.style.color = "#3b82f6";
    dom.textContent = this.__text;
    return dom;
  }

  updateDOM() {
    return false;
  }
}

export function $createMentionNode(text) {
  return new MentionNode(text);
}

export function $isMentionNode(node) {
  return node instanceof MentionNode;
}
