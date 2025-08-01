import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

interface IProps {
  label?: string;
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  language?: string;
}

function CodeEditor(props: IProps) {
  const onChange = (value: string) => {
    if (props.onChange) {
      props.onChange(value);
    }
  };

  return (
    <AceEditor
      mode={props.language || "javascript"}
      theme="github"
      width="100%"
      height="400px"
      onChange={onChange}
      value={props.value}
      readOnly={props.disabled}
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
        showLineNumbers: true,
        tabSize: 2,
      }}
    />
  );
}

export default CodeEditor;
