'use client';

import { useState, useRef, useEffect } from 'react';
import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/app-footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Download, 
  Upload, 
  Trash2, 
  Music, 
  ArrowLeft,
  Save,
  RotateCcw
} from 'lucide-react';
import Link from 'next/link';

const TAB_LINE = `    |
e   |---------------------------------------------------------------------------|
B   |---------------------------------------------------------------------------|
G   |---------------------------------------------------------------------------|
D   |---------------------------------------------------------------------------|
A   |---------------------------------------------------------------------------|
E   |---------------------------------------------------------------------------|
`;

const LYRICS_LINE = `Notes   |                                                                       
Lyrics  |
`;

interface TablatureData {
  title: string;
  artist: string;
  content: string;
}

interface TabEditorUIProps {
  tabData: TablatureData;
  onTabDataChange: (data: TablatureData) => void;
  onClear: () => void;
  onAddLine: () => void;
  onAddLyrics: () => void;
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

function TabEditorUI({
  tabData,
  onTabDataChange,
  onClear,
  onAddLine,
  onAddLyrics,
  onExport,
  onImport,
  fileInputRef
}: TabEditorUIProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Guitar Tablature Editor</h1>
        <p className="text-muted-foreground">Create and edit guitar tablatures with ease</p>
      </div>

      {/* Controls */}
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Tablature Settings
          </CardTitle>
          <CardDescription>
            Configure your tablature settings and metadata
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Song Title</Label>
              <Input
                id="title"
                value={tabData.title}
                onChange={(e) => onTabDataChange({ ...tabData, title: e.target.value })}
                placeholder="Enter song title..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="artist">Artist</Label>
              <Input
                id="artist"
                value={tabData.artist}
                onChange={(e) => onTabDataChange({ ...tabData, artist: e.target.value })}
                placeholder="Enter artist name..."
              />
            </div>
          </div>

          <Separator />

          <div className="flex gap-2 flex-wrap">
            <Button onClick={onClear} variant="outline" size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              Clear
            </Button>
            <Button onClick={onAddLine} variant="outline" size="sm">
              <RotateCcw className="mr-2 h-4 w-4" />
              Add Line
            </Button>
            <Button onClick={onAddLyrics} variant="outline" size="sm">
              <Music className="mr-2 h-4 w-4" />
              Add Lyrics
            </Button>
            <Button onClick={onExport} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export JSON
            </Button>
            <Button 
              onClick={() => fileInputRef.current?.click()} 
              variant="outline" 
              size="sm"
            >
              <Upload className="mr-2 h-4 w-4" />
              Import JSON
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={onImport}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tablature Editor */}
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>ASCII Tablature Editor</CardTitle>
          <CardDescription>
            Edit your tablature in ASCII format. Export and import as JSON files for easy sharing and storage.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {/* Song Info Display */}
          {(tabData.title || tabData.artist) && (
            <div className="p-4 bg-gray-50 border-b font-mono text-sm">
              {tabData.title && <div className="font-semibold">Title: {tabData.title}</div>}
              {tabData.artist && <div className="text-muted-foreground">Artist: {tabData.artist}</div>}
            </div>
          )}
          <Textarea
            value={tabData.content}
            onChange={(e) => onTabDataChange({ ...tabData, content: e.target.value })}
            className="font-mono text-sm leading-relaxed h-[60vh] resize-none border-0 focus:ring-0 focus:border-0"
            placeholder={TAB_LINE}
          />
        </CardContent>
      </Card>

      {/* Preview */}
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>
            Preview of your tablature as it will appear when exported
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[40vh] w-full">
            <div className="p-6 bg-gray-50">
              <div className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
                {tabData.title && `Title: ${tabData.title}\n`}
                {tabData.artist && `Artist: ${tabData.artist}\n`}
                {(tabData.title || tabData.artist) && '\n'}
                {tabData.content}
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

export default function TablatureEditorPage() {
  const [tabData, setTabData] = useState<TablatureData>({
    title: '',
    artist: '',
    content: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearTab = () => {
    setTabData({
      title: '',
      artist: '',
      content: ''
    });
  };

  const exportTab = () => {
    const tablatureData = {
      id: `tab_${Date.now()}`,
      title: tabData.title,
      artist: tabData.artist,
      description: `Tablature created with Tablature Editor`,
      asciiContent: tabData.content,
      difficulty: 'Medium',
      createdAt: new Date().toISOString(),
      fileName: `${tabData.title || 'tablature'}.json`
    };
    
    const jsonContent = JSON.stringify(tablatureData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tabData.title || 'tablature'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Save to localStorage for linking to videos
    if (tabData.title && tabData.artist) {
      const savedTablatures = localStorage.getItem('tablatureFiles');
      const files = savedTablatures ? JSON.parse(savedTablatures) : [];
      files.push(tablatureData);
      localStorage.setItem('tablatureFiles', JSON.stringify(files));
      
      console.log('Tablature saved with ID:', tablatureData.id);
    }
  };

  const importTab = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        // Validate the JSON structure
        if (data.title && data.artist && data.asciiContent) {
          setTabData({
            title: data.title,
            artist: data.artist,
            content: data.asciiContent
          });
          console.log('Tablature loaded successfully from JSON');
        } else {
          throw new Error('Invalid tablature JSON format');
        }
      } catch (error) {
        console.error('Error loading tablature JSON:', error);
        // Fallback to plain text parsing for backward compatibility
        const content = e.target?.result as string;
        const lines = content.split('\n');
        
        let title = '';
        let artist = '';
        let tabContent = '';
        
        lines.forEach(line => {
          if (line.startsWith('Title:')) {
            title = line.replace('Title:', '').trim();
          } else if (line.startsWith('Artist:')) {
            artist = line.replace('Artist:', '').trim();
          } else if (line.includes('|') || line.trim() === 'Notes') {
            tabContent += line + '\n';
          }
        });
        
        setTabData({
          title,
          artist,
          content: tabContent.trim()
        });
        console.log('Tablature loaded as plain text (fallback)');
      }
    };
    reader.readAsText(file);
  };

  const addLine = () => {
    setTabData(prev => ({
      ...prev,
      content: prev.content + '\n\n' + TAB_LINE
    }));
  };

  const addLyrics = () => {
    setTabData(prev => ({
      ...prev,
      content: prev.content + '\n\n' + LYRICS_LINE
    }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <AppHeader />
      <main className="flex-grow container mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button asChild variant="outline" size="sm">
            <Link href="/showcase?section=guitar">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Guitar Videos
            </Link>
          </Button>
        </div>

        <TabEditorUI
          tabData={tabData}
          onTabDataChange={setTabData}
          onClear={clearTab}
          onAddLine={addLine}
          onAddLyrics={addLyrics}
          onExport={exportTab}
          onImport={importTab}
          fileInputRef={fileInputRef}
        />
      </main>
      <AppFooter />
    </div>
  );
} 