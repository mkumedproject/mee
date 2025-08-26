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
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        ['clean'],
        // Custom paste handling
        ['paste']
      ],
      handlers: {
        'paste': function() {
          // Custom paste handler to preserve formatting
          const range = this.quill.getSelection();
          if (range) {
            // Allow default paste behavior but ensure formatting is preserved
            setTimeout(() => {
              const content = this.quill.getContents();
              onChange(this.quill.root.innerHTML);
            }, 10);
          }
        }
      }
    },
    clipboard: {
      // Enhanced clipboard handling for better formatting preservation
      matchVisual: true,
      matchers: [
        // Preserve headers
        ['H1', (node, delta) => {
          return delta.compose(new (window as any).Quill.import('delta')().retain(delta.length(), { header: 1 }));
        }],
        ['H2', (node, delta) => {
          return delta.compose(new (window as any).Quill.import('delta')().retain(delta.length(), { header: 2 }));
        }],
        ['H3', (node, delta) => {
          return delta.compose(new (window as any).Quill.import('delta')().retain(delta.length(), { header: 3 }));
        }],
        ['H4', (node, delta) => {
          return delta.compose(new (window as any).Quill.import('delta')().retain(delta.length(), { header: 4 }));
        }],
        ['H5', (node, delta) => {
          return delta.compose(new (window as any).Quill.import('delta')().retain(delta.length(), { header: 5 }));
        }],
        ['H6', (node, delta) => {
          return delta.compose(new (window as any).Quill.import('delta')().retain(delta.length(), { header: 6 }));
        }],
        // Preserve formatting
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
        // Handle markdown-style formatting
        ['P', (node, delta) => {
          const text = node.textContent || '';
          if (text.startsWith('### ')) {
            return new (window as any).Quill.import('delta')().insert(text.substring(4), { header: 3 });
          } else if (text.startsWith('## ')) {
            return new (window as any).Quill.import('delta')().insert(text.substring(3), { header: 2 });
          } else if (text.startsWith('# ')) {
            return new (window as any).Quill.import('delta')().insert(text.substring(2), { header: 1 });
          }
          return delta;
        }],
        // Preserve divs and spans
        ['DIV', (node, delta) => delta],
        ['SPAN', (node, delta) => delta]
      ]
    }
  }), [onChange]);

  const formats = [
    'header', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet', 'indent',
    'align',
    'blockquote', 'code-block',
    'link', 'image', 'video'
  ];

  // Handle content change with formatting preservation
  const handleChange = (content: string, delta: any, source: any, editor: any) => {
    // Preserve the HTML formatting
    const html = editor.getHTML();
    onChange(html);
  };

  return (
    <div className="rich-text-editor">
      <style>{`
        .ql-editor {
          color: #111827 !important;
          background-color: white !important;
        }
        .ql-editor p,
        .ql-editor h1,
        .ql-editor h2,
        .ql-editor h3,
        .ql-editor h4,
        .ql-editor h5,
        .ql-editor h6,
        .ql-editor ul,
        .ql-editor ol,
        .ql-editor li,
        .ql-editor blockquote,
        .ql-editor pre,
        .ql-editor code {
          color: #111827 !important;
        }
        .ql-editor.ql-blank::before {
          color: #9CA3AF !important;
        }
        .ql-toolbar {
          border-color: #D1D5DB !important;
          background-color: #F9FAFB !important;
        }
        .ql-container {
          border-color: #D1D5DB !important;
          background-color: white !important;
        }
        .ql-toolbar .ql-formats button {
          color: #374151 !important;
        }
        .ql-toolbar .ql-formats button:hover {
          color: #111827 !important;
        }
        .ql-toolbar .ql-formats .ql-picker-label {
          color: #374151 !important;
        }
        .ql-toolbar .ql-formats .ql-picker-options {
          background-color: white !important;
          border-color: #D1D5DB !important;
        }
        .ql-toolbar .ql-formats .ql-picker-item {
          color: #374151 !important;
        }
      `}</style>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={handleChange}
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
