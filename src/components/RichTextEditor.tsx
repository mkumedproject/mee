import React, { useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing your content...",
  height = "300px"
}) => {
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        ['clean']
      ],
    },
    clipboard: {
      matchVisual: true,
      matchers: [
        // Custom matcher to preserve markdown-style formatting
        ['B', function(node: any, delta: any) {
          return delta.compose(new (window as any).Quill.import('delta')().retain(delta.length(), { bold: true }));
        }],
        ['STRONG', function(node: any, delta: any) {
          return delta.compose(new (window as any).Quill.import('delta')().retain(delta.length(), { bold: true }));
        }],
        // Handle asterisk-based markdown bold text
        [Node.TEXT_NODE, function(node: any, delta: any) {
          if (typeof node.data === 'string') {
            let text = node.data;
            // Convert **text** to bold
            text = text.replace(/\*\*(.*?)\*\*/g, function(match: string, content: string) {
              const Delta = (window as any).Quill.import('delta');
              return content;
            });
            if (text !== node.data) {
              const Delta = (window as any).Quill.import('delta');
              const newDelta = new Delta().insert(text, { bold: true });
              return newDelta;
            }
          }
          return delta;
        }]
      ]
    },
    history: {
      delay: 1000,
      maxStack: 50,
      userOnly: true
    }
  }), []);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet', 'indent',
    'direction', 'align',
    'blockquote', 'code-block',
    'link', 'image', 'video'
  ];

  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        preserveWhitespace={true}
        style={{
          height: height,
          marginBottom: '42px' // Account for toolbar height
        }}
      />
    </div>
  );
};

export default RichTextEditor;