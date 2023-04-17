import dynamic from "next/dynamic";

const AceEditor = dynamic(
  async () => {
    const ace = await import("react-ace");
    await import("ace-builds/src-noconflict/mode-jsx");
    await import("ace-builds/src-noconflict/theme-one_dark");
    return ace;
  },
  { ssr: false }
);

interface EditorProps {
  code: string;
  height?: string;
  onChange?: (code: string) => void;
  readonly?: boolean;
  showGutter?: boolean;
  color?: string;
}

const Editor: React.FC<EditorProps> = ({
  code = "",
  height = "50vh",
  onChange,
  readonly = false,
  showGutter = true,
  color = "#111215",
}) => {
  return (
    <div style={{ height }} className="bg-[#111215]">
      {AceEditor && (
        <>
          <AceEditor
            showGutter={showGutter}
            mode="jsx"
            theme="one_dark"
            value={code}
            onChange={onChange}
            showPrintMargin={false}
            name="code-editor"
            editorProps={{ $blockScrolling: true }}
            width="100%"
            height={height}
            readOnly={readonly}
            fontSize={"0.9rem"}
            style={{ backgroundColor: color }}
          />
        </>
      )}
    </div>
  );
};

export default Editor;
