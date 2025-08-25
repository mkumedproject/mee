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
      matchers: [
        ['PRE', (node, delta) => delta],        // Preserve preformatted blocks
        ['CODE', (node, delta) => delta],       // Preserve inline code/excerpts
        ['P', (node, delta) => delta],          // Preserve paragraphs
        ['STRONG', (node, delta) => delta],     // Preserve <strong> (bold)
        ['B', (node, delta) => delta],          // Preserve <b>
        ['EM', (node, delta) => delta],         // Preserve <em> (italic)
        ['I', (node, delta) => delta],          // Preserve <i>
        ['BLOCKQUOTE', (node, delta) => delta], // Preserve blockquotes
        ['UL', (node, delta) => delta],         // Preserve unordered lists
        ['OL', (node, delta) => delta],         // Preserve ordered lists
        ['LI', (node, delta) => delta],         // Preserve list items
        ['H1', (node, delta) => delta],         // Preserve headings
        ['H2', (node, delta) => delta],
        ['H3', (node, delta) => delta],
        ['H4', (node, delta) => delta],
        ['H5', (node, delta) => delta],
        ['H6', (node, delta) => delta]
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
