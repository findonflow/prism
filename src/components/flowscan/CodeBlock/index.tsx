/* --------------------------------------------------------------------------------------------- */
"use client";
/* --------------------------------------------------------------------------------------------- */
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import MonacoEditor, { DiffEditor, Monaco, MonacoDiffEditor } from "@monaco-editor/react";
import configureCadence from "./configureCadence";
import type { Highlight } from "./types.ts";

/* --------------------------------------------------------------------------------------------- */

interface Props {
  code: string;
  diff?: string;
  showDiff?: boolean;
  highlights?: Array<Highlight>;
  setEditorPropLift?: Dispatch<SetStateAction<any>>;
}

interface Vars {
  editor: any; // we can fix this by importing monaco-editor package and getting "editor" namespace from it later
  monaco: Monaco | null;
}

function addHighlight(monaco: Monaco) {
  return function (highlight: Highlight) {
    const { row, errorMessage } = highlight;

    return {
      range: new monaco.Range(row, 1, row, 1),
      options: {
        isWholeLine: true,
        className: "cadence-error",
        inlineClassName: "cadence-error",
        after: {
          content: "Error: " + errorMessage,
          margin: "10px",
          color: "red",
        },
      },
    };
  };
}

const makeTheme = (monaco: any, themeName: string) => {
  const baseName = themeName.split("-")[1];
  const base = baseName === "dark" ? "vs-dark" : "vs";

  const editorTheme = `custom-${base}`;
  monaco.editor.defineTheme(editorTheme, {
    base,
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#2e353f",
    },
  });
  monaco.editor.setTheme(editorTheme);
};

export default function CodeBlock(props: Props) {
  const { code, highlights, setEditorPropLift } = props;
  const { showDiff, diff } = props;

  const themeName = "fd-dark";

  const [vars, setVars] = useState<Vars>({
    editor: null,
    monaco: null,
  });
  const options = {
    readOnly: true,
    minimap: {
      enabled: false,
    },
    scrollbar: {
      handleMouseWheel: true,
      alwaysConsumeMouseWheel: false,
    },
    wordWrap: "on",
    automaticLayout: true,
    scrollBeyondLastLine: false,
    scrollBeyondLastColumn: false,
    wrappingStrategy: "advanced",
  };

  const decorations = useRef<any>(null);
  const editorContainer = useRef<HTMLDivElement>(null);
  const debouncedTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (vars) {
      const { editor, monaco } = vars;
      if (editor && monaco) {
        if (decorations.current) {
          decorations.current.clear();
        }
        if (setEditorPropLift) {
          setEditorPropLift(editor);
        }
        const mapHighlight = addHighlight(monaco);
        decorations.current = editor.createDecorationsCollection(
          (highlights || []).map(mapHighlight),
        );
      }
    }
  }, [highlights, vars]);
  useEffect(() => {
    if (vars.monaco) {
      makeTheme(vars.monaco, themeName);
    }
  }, [themeName]);

  function registerResizeListener(editor: any) {
    const resizeObserver = new ResizeObserver(() => {
      if (debouncedTimerRef.current) {
        clearTimeout(debouncedTimerRef.current);
      }
      debouncedTimerRef.current = setTimeout(() => {
        editor.layout();
        debouncedTimerRef.current = null;
      }, 150);
    });
    resizeObserver.observe(editorContainer.current!);
  }

  const onMount = (editor: any, monaco: any) => {
    configureCadence(monaco);
    makeTheme(monaco, themeName);
    setVars({ editor, monaco });

    /*    themeContext.addReaction("monaco-theme", (theme: ThemeInterface) => {
      makeTheme(monaco, theme);
    });*/

    // editor.updateOptions({wordWrap: "on"})
    const editorElement = editor && editor.getDomNode && editor?.getDomNode();

    if (!editorElement) {
      return;
    }

    const lineHeight = editor.getOption(monaco.editor.EditorOption.lineHeight);
    const lineCount = editor.getModel()?.getLineCount() + 2 || 1;
    const height = lineHeight * lineCount;
    editorElement.style.height = `${height}px`;
    editor.layout();
    registerResizeListener(editor);
  };

  const onDiffMount = (editor: MonacoDiffEditor, monaco: any) => {
    configureCadence(monaco);
    makeTheme(monaco, themeName);
    setVars({ editor, monaco });

    /*    themeContext.addReaction("monaco-theme", (theme: ThemeInterface) => {
      makeTheme(monaco, theme);
    });*/

    // editor.updateOptions({wordWrap: "on"})
    const diffEditor = editor.getOriginalEditor();
    const editorElement = editor && editor.getContainerDomNode && editor?.getContainerDomNode();

    if (!editorElement) {
      return;
    }

    const lineHeight = diffEditor.getOption(monaco.editor.EditorOption.lineHeight);

    const originalLineCount = editor.getOriginalEditor().getModel()?.getLineCount() || 0;
    const diffLineCount = editor.getModifiedEditor().getModel()?.getLineCount() || 0;

    const lineCount = Math.max(originalLineCount, diffLineCount);

    const height = lineHeight * lineCount;
    editorElement.style.height = `${height}px`;
    editor.layout();
    registerResizeListener(editor);
  };

  const editorWithDiff = showDiff && diff;

  return (
    <div
      ref={editorContainer}
      className="flex h-full w-full flex-col items-start gap-4 overflow-hidden bg-blue-dark [&:last-child]:mb-0 [&_section]:min-h-[40vh]">
      {!editorWithDiff && (
        <MonacoEditor
          language={"cadence"}
          value={code}
          height={"100%"}
          options={{
            ...(options as any),
            fontSize: 14,
            renderLineHighlight: "none",
            automaticLayout: false,
            // scrollbar: {
            //   verticalScrollbarSize: 5,
            // },
          }}
          onMount={onMount}
          beforeMount={(monaco: any) => makeTheme(monaco, themeName)}
        />
      )}

      {editorWithDiff && (
        <DiffEditor
          height={"100%"}
          language={"cadence"}
          original={diff}
          modified={code}
          onMount={onDiffMount}
          options={{ ...(options as any), renderSideBySide: false, fontSize: 14 }}
          beforeMount={(monaco: any) => makeTheme(monaco, themeName)}
        />
      )}
    </div>
  );
}
