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
      matchVisual: false,
      // Enhanced clipboard handling for better formatting preservation
      matchers: [
        // Convert markdown-style headers to proper headers
        ['P', (node, delta) => {
          const text = node.textContent || '';
          if (text.startsWith('### ')) {
            return delta.compose(new (window as any).Quill.import('delta')().insert(text.substring(4), { header: 3 }));
          } else if (text.startsWith('## ')) {
            return delta.compose(new (window as any).Quill.import('delta')().insert(text.substring(3), { header: 2 }));
          } else if (text.startsWith('# ')) {
            return delta.compose(new (window as any).Quill.import('delta')().insert(text.substring(2), { header: 1 }));
          }
          return delta;
        }],
        // Preserve all other formatting
        ['STRONG', (node, delta) => delta],
        ['B', (node, delta) => delta],
        ['EM', (node, delta) => delta],
        ['I', (node, delta) => delta],
        ['U', (node, delta) => delta],
        ['CODE', (node, delta) => delta],
        ['PRE', (node, delta) => delta],
        ['BLOCKQUOTE', (node, delta) => delta],
        ['UL', (node, delta) => delta],
        ['OL', (node, delta) => delta],
        ['LI', (node, delta) => delta],
        ['H1', (node, delta) => delta],
        ['H2', (node, delta) => delta],
        ['H3', (node, delta) => delta],
        ['H4', (node, delta) => delta],
        ['H5', (node, delta) => delta],
        ['H6', (node, delta) => delta],
        ['DIV', (node, delta) => delta],
        ['SPAN', (node, delta) => delta]
      ]
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
        style={{
          height: height,
          marginBottom: '42px'
        }}
      />
    </div>
  );
};

export default RichTextEditor;
