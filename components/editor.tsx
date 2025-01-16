"use client";

import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from './ui/button';
import { 
  ImageIcon, 
  Undo, 
  Redo, 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Link as LinkIcon,
  Heading1,
  Heading2,
  Heading3,
  Code,
  Quote,
  Sparkles
} from 'lucide-react';
import { useState } from 'react';
import { getGeminiSuggestion } from '@/lib/gemini';
import { Input } from './ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Editor({ onUpdate }: { onUpdate?: (html: string) => void }) {
  const [aiLoading, setAiLoading] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500 underline',
        },
      }),
      Placeholder.configure({
        placeholder: 'Start with title of your notes...',
        emptyEditorClass: 'cursor-text before:content-[attr(data-placeholder)] before:text-gray-500 before:float-left before:h-0 before:pointer-events-none',
      }),
    ],
    onUpdate: ({ editor }) => {
      onUpdate?.(editor.getHTML());
    },
    content: '',
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[200px]',
      },
    },
  });

  const addImage = () => {
    const url = window.prompt('Enter image URL');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    if (!editor) return;
    
    const previousUrl = editor.getAttributes('link').href;
    if (previousUrl) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };

  const getAiSuggestion = async () => {
    if (!editor) return;
    
    setAiLoading(true);
    const content = editor.getHTML();
    const suggestion = await getGeminiSuggestion(`
      Analyze the following notes and provide thoughtful suggestions:
      
      ${content}
      
      Please consider:
      1. Key points that might be missing
      2. Potential clarifications needed
      3. Related concepts worth exploring
      
      Format your response should be in a clear, concise keep it strictly less than 200 words way that can be directly added to the notes.
    `);
    setAiLoading(false);

    if (suggestion) {
      editor.chain().focus().createParagraphNear().insertContent(
        `<div class="p-4 my-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
          <p class="text-sm text-blue-800 dark:text-blue-200 font-medium mb-2">✨ AI Suggestions:</p>
          <div class="text-sm text-blue-700 dark:text-blue-300">
            ${suggestion}
          </div>
        </div>`
      ).run();
    }
  };

  if (!editor) return null;

  return (
    <div className="border rounded-lg">
      <div className="border-b p-2 flex gap-2 flex-wrap bg-muted/50">
        <div className="w-px h-4 bg-border my-auto" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-muted' : ''}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-muted' : ''}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={editor.isActive('code') ? 'bg-muted' : ''}
        >
          <Code className="h-4 w-4" />
        </Button>
        <div className="w-px h-4 bg-border my-auto" />
        <div className="w-px h-4 bg-border my-auto" />
        <Popover open={showLinkInput} onOpenChange={setShowLinkInput}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={editor.isActive('link') ? 'bg-muted' : ''}
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-3">
            <div className="flex gap-2">
              <Input
                placeholder="Enter URL"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addLink();
                  }
                }}
              />
              <Button onClick={addLink}>Add</Button>
            </div>
          </PopoverContent>
        </Popover>
        <Button
          variant="ghost"
          size="sm"
          onClick={addImage}
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <div className="w-px h-4 bg-border my-auto" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo className="h-4 w-4" />
        </Button>
        <div className="flex-grow" />
        <Button
          variant="secondary"
          size="sm"
          onClick={getAiSuggestion}
          disabled={aiLoading}
          className="gap-2"
        >
          <Sparkles className="h-4 w-4" />
          {aiLoading ? 'Getting Suggestions...' : 'Get AI Suggestions'}
        </Button>
      </div>

      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          className="bg-popover text-popover-foreground shadow-md border rounded-lg overflow-hidden flex"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'bg-muted' : ''}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'bg-muted' : ''}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLinkInput(true)}
            className={editor.isActive('link') ? 'bg-muted' : ''}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
        </BubbleMenu>
      )}

      <div className="p-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}