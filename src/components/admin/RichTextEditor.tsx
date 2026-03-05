"use client";

import { MouseEvent, useEffect, useRef, useState } from "react";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export default function RichTextEditor({ label, value, onChange }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<Range | null>(null);
  const [textColor, setTextColor] = useState("#ffffff");

  useEffect(() => {
    if (!ref.current) return;
    if (ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || "";
    }
  }, [value]);

  function saveSelection() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    selectionRef.current = selection.getRangeAt(0);
  }

  function restoreSelection() {
    const selection = window.getSelection();
    if (!selection || !selectionRef.current) return;
    selection.removeAllRanges();
    selection.addRange(selectionRef.current);
  }

  function applyColorFallback(color: string) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);

    if (!ref.current?.contains(range.commonAncestorContainer)) return;

    const span = document.createElement("span");
    span.style.color = color;

    if (range.collapsed) {
      const textNode = document.createTextNode("\u200b");
      span.appendChild(textNode);
      range.insertNode(span);
      range.setStart(textNode, 1);
      range.setEnd(textNode, 1);
      selection.removeAllRanges();
      selection.addRange(range);
      return;
    }

    try {
      range.surroundContents(span);
    } catch {
      const fragment = range.extractContents();
      span.appendChild(fragment);
      range.insertNode(span);
    }

    selection.removeAllRanges();
    const nextRange = document.createRange();
    nextRange.selectNodeContents(span);
    selection.addRange(nextRange);
  }

  function exec(command: string, commandValue?: string) {
    ref.current?.focus();
    restoreSelection();
    document.execCommand("styleWithCSS", false, "true");
    let success = false;
    if (commandValue) {
      success = document.execCommand(command, false, commandValue);
    } else {
      success = document.execCommand(command);
    }

    if (!success && command === "foreColor" && commandValue) {
      applyColorFallback(commandValue);
    }
    saveSelection();
    onChange(ref.current?.innerHTML || "");
  }

  function handleToolbarClick(
    event: MouseEvent<HTMLButtonElement>,
    command: string,
    commandValue?: string
  ) {
    event.preventDefault();
    exec(command, commandValue);
  }

  return (
    <label className="admin-field">
      <span>{label}</span>
      <div className="editor-toolbar">
        <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={(event) => handleToolbarClick(event, "bold")}>B</button>
        <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={(event) => handleToolbarClick(event, "italic")}>I</button>
        <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={(event) => handleToolbarClick(event, "insertUnorderedList")}>• Liste</button>
        <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={(event) => handleToolbarClick(event, "removeFormat")}>
          Format reset
        </button>
        <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={(event) => handleToolbarClick(event, "foreColor", "#000000")}>
          Schwarz
        </button>
        <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={(event) => handleToolbarClick(event, "foreColor", "#ffffff")}>
          Weiß
        </button>
        <input
          type="color"
          value={textColor}
          onMouseDown={saveSelection}
          onChange={(event) => setTextColor(event.target.value)}
          aria-label="Textfarbe wählen"
        />
        <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={(event) => handleToolbarClick(event, "foreColor", textColor)}>Textfarbe</button>
      </div>
      <div
        ref={ref}
        className="editor"
        contentEditable
        suppressContentEditableWarning
        dangerouslySetInnerHTML={{ __html: value }}
        onMouseUp={saveSelection}
        onKeyUp={saveSelection}
        onFocus={saveSelection}
        onInput={(event) => onChange((event.target as HTMLDivElement).innerHTML)}
      />
    </label>
  );
}
