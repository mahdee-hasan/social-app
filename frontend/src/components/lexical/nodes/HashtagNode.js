import { TextNode } from "lexical";

export class HashtagNode extends TextNode {
  static getType() {
    return "hashtag";
  }

  static clone(node) {
    return new HashtagNode(node.__text, node.__key);
  }

  static importJSON(serializedNode) {
    const node = $createHashtagNode(serializedNode.text);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }

  exportJSON() {
    return {
      ...super.exportJSON(),
      type: "hashtag",
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

export function $createHashtagNode(text) {
  return new HashtagNode(text);
}

export function $isHashtagNode(node) {
  return node instanceof HashtagNode;
}
