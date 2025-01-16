"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Editor } from '@/components/editor';
import { ThemeToggle } from '@/components/theme-toggle';
import { Download, Play } from 'lucide-react';
import { NotebookPen } from 'lucide-react';
import dynamic from 'next/dynamic';
import html2pdf from 'html2pdf.js';



export default function Home() {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [notes, setNotes] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [player, setPlayer] = useState<any>(null);
  const playerRef = useRef<HTMLIFrameElement>(null);



  const extractVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : '';
  };

  const handleUrlSubmit = () => {
    const id = extractVideoId(videoUrl);
    if (id) {
      setVideoId(id);
    }
  };


  const downloadNotes = async () => {
    const html2pdfModule = await import('html2pdf.js');
    const html2pdf = html2pdfModule.default;
    
    const content = document.createElement("div");
    content.innerHTML= `
      <h1 style="color: #000000;">Video Notes</h1>
      <p style="color: #000000;"><strong>Video URL:</strong><a href="https://youtube.com/watch?v=${videoId}" style="color: #000000;">https://youtube.com/watch?v=${videoId}</a> </p>
      <div class="notes-content" style="color: #000000;">
        ${notes}
      </div>
    `;

    const opt = {
      margin: 1,
      filename: 'Notes.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(content).save();
  };

  return (
    <div className="min-h-screen mx-auto max-w-5xl bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold flex justify-center items-center"><NotebookPen className='mr-1' />{" "}NotesPlay</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-4">
            <div className="flex gap-4">
              <Input
                type="text"
                placeholder="Enter YouTube URL"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
              <Button onClick={handleUrlSubmit}>
                <Play className="w-4 h-4 mr-2" />
                Load Video
              </Button>
            </div>

            {videoId && (
              <div className="aspect-video">
                <iframe
                  ref={playerRef}
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              {/* <Button onClick={insertTimestamp}>Insert Timestamp</Button> */}
              <Button onClick={downloadNotes} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download Notes
              </Button>
            </div>
            
            <Editor onUpdate={(html) => setNotes(html)} />
          </div>
        </div>
      </main>
    </div>
  );
}