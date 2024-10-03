'use client';
import { useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Heading from '@tiptap/extension-heading';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';

// Icons
import {
  Bold,
  Italic,
  Link as LinkIcon,
  Link2Off,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ListOrdered,
  List,
  UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
} from 'lucide-react';
import { Button } from '../ui/button';

// Define props for the Tiptap component
interface TiptapProps {
  onChange?: (content: string) => void;
  initialContent?: string;
  isViewer?: boolean;
}

const Tiptap = ({
  onChange,
  initialContent = '',
  isViewer = false,
}: TiptapProps) => {
  // State for link insertion
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false);

  // State for image upload
  const [isImagePopoverOpen, setIsImagePopoverOpen] = useState(false);

  // Initialize the editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      TextStyle,
      Color,
      Underline,
      Heading.configure({
        levels: [1, 2, 3, 4],
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: isViewer
          ? 'p-0'
          : 'rounded-sm border p-1 border-input min-h-[40rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      },
    },
    editable: !isViewer,
  });

  if (!editor) {
    return null;
  }

  // Handle link insertion
  const handleLinkInsert = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl, target: '_blank' }).run();
      if (linkText) {
        editor.chain().focus().insertContent(linkText).run();
      }
      setLinkUrl('');
      setLinkText('');
      setIsLinkPopoverOpen(false);
    }
  };

  // Handle image upload
  const handleImageUpload = (files: { url: string; name: string }[]) => {
    if (files.length > 0) {
      editor.chain().focus().setImage({ src: files[0]!.url }).run();
      setIsImagePopoverOpen(false);
    }
  };

  return (
    <div className="space-y-2">
      {!isViewer && (
        <div className="flex flex-wrap items-center gap-2">
          {/* Bold */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'bg-accent' : ''}
          >
            <Bold className="h-4 w-4" />
          </Button>

          {/* Italic */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'bg-accent' : ''}
          >
            <Italic className="h-4 w-4" />
          </Button>

          {/* Underline */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={editor.isActive('underline') ? 'is-active' : ''}
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>

          {/* Align Left */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={
              editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''
            }
          >
            <AlignLeft className="h-4 w-4" />
          </Button>

          {/* Align Center */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={
              editor.isActive({ textAlign: 'center' }) ? 'bg-accent' : ''
            }
          >
            <AlignCenter className="h-4 w-4" />
          </Button>

          {/* Align Right */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={
              editor.isActive({ textAlign: 'right' }) ? 'bg-accent' : ''
            }
          >
            <AlignRight className="h-4 w-4" />
          </Button>

          {/* Bullet List */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'bg-accent' : ''}
          >
            <List className="h-4 w-4" />
          </Button>

          {/* Ordered List */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'bg-accent' : ''}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>

          {/* Color Picker */}
          {/* Color Picker */}
          <div className="relative h-8 w-8">
            <input
              type="color"
              onChange={(e) =>
                editor.chain().focus().setColor(e.target.value).run()
              }
              className="absolute inset-0 cursor-pointer opacity-0"
            />
            <div
              className="h-8 w-8 overflow-hidden rounded-full border border-input"
              style={{
                backgroundColor:
                  (editor.getAttributes('textStyle').color as string) ||
                  '#000000',
              }}
            />
          </div>

          {/* Heading 1 */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={
              editor.isActive('heading', { level: 1 }) ? 'is-active' : ''
            }
          >
            <Heading1 className="h-4 w-4" />
          </Button>

          {/* Heading 2 */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={
              editor.isActive('heading', { level: 2 }) ? 'is-active' : ''
            }
          >
            <Heading2 className="h-4 w-4" />
          </Button>

          {/* Heading 3 */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={
              editor.isActive('heading', { level: 3 }) ? 'is-active' : ''
            }
          >
            <Heading3 className="h-4 w-4" />
          </Button>

          {/* Heading 4 */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 4 }).run()
            }
            className={
              editor.isActive('heading', { level: 4 }) ? 'is-active' : ''
            }
          >
            <Heading4 className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Editor Content */}
      <EditorContent editor={editor} className="tiptap" />
    </div>
  );
};

export default Tiptap;
