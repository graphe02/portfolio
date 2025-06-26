'use client';

import { useParams } from 'next/navigation';
import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/app-footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Download, FileText, Music } from 'lucide-react';
import Link from 'next/link';
import { tablatures } from '@/lib/data';
import { useState, useEffect } from 'react';

interface TablatureFile {
  id: string;
  title: string;
  artist: string;
  content: string;
  fileName: string;
}

export default function TablatureViewerPage() {
  const params = useParams();
  const tabId = params.tabId as string;
  
  const [tablatureFile, setTablatureFile] = useState<TablatureFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Find tablature from data file
  const tablature = tablatures.find(tab => tab.id === tabId);

  // Load tablature file from localStorage if it exists
  useEffect(() => {
    const savedTablatures = localStorage.getItem('tablatureFiles');
    if (savedTablatures) {
      const files: TablatureFile[] = JSON.parse(savedTablatures);
      const file = files.find(f => f.id === tabId);
      if (file) {
        setTablatureFile(file);
      }
    }
  }, [tabId]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      // Parse the file content to extract title, artist, and tablature
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
      
      const newTablatureFile: TablatureFile = {
        id: tabId,
        title: title || file.name.replace('.txt', ''),
        artist: artist || 'Unknown Artist',
        content: tabContent.trim(),
        fileName: file.name
      };
      
      setTablatureFile(newTablatureFile);
      
      // Save to localStorage
      const savedTablatures = localStorage.getItem('tablatureFiles');
      const files: TablatureFile[] = savedTablatures ? JSON.parse(savedTablatures) : [];
      const updatedFiles = files.filter(f => f.id !== tabId);
      updatedFiles.push(newTablatureFile);
      localStorage.setItem('tablatureFiles', JSON.stringify(updatedFiles));
      
      setIsLoading(false);
    };
    reader.readAsText(file);
  };

  const downloadTablature = () => {
    if (!tablature && !tablatureFile) return;
    
    const content = tablature 
      ? `Title: ${tablature.title}
Artist: ${tablature.artist}
Tabbed by: Tablature Editor

${tablature.asciiContent}`
      : `Title: ${tablatureFile!.title}
Artist: ${tablatureFile!.artist}
Tabbed by: Tablature Editor

${tablatureFile!.content}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tablature?.title || tablatureFile?.title || 'tablature'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!tablature && !tablatureFile) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
        <AppHeader />
        <main className="flex-grow container mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Button asChild variant="outline" size="sm">
              <Link href="/guitar">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Guitar Videos
              </Link>
            </Button>
          </div>
          
          <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Tablature Not Found
              </CardTitle>
              <CardDescription>
                This tablature doesn't exist yet. You can upload an exported tablature file from the editor.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  Upload a tablature file exported from the Tablature Editor
                </p>
                <Button 
                  onClick={() => document.getElementById('file-upload')?.click()} 
                  variant="outline"
                  disabled={isLoading}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  {isLoading ? 'Loading...' : 'Upload Tablature File'}
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  accept=".txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>
        </main>
        <AppFooter />
      </div>
    );
  }

  const currentTablature = tablature || tablatureFile;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <AppHeader />
      <main className="flex-grow container mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button asChild variant="outline" size="sm">
            <Link href="/guitar">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Guitar Videos
            </Link>
          </Button>
        </div>

        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">{currentTablature?.title}</h1>
            <p className="text-xl text-muted-foreground mb-4">by {currentTablature?.artist}</p>
            {tablature && (
              <div className="flex justify-center gap-2">
                <Badge variant="secondary">{tablature.difficulty}</Badge>
                <Badge variant="outline">From Library</Badge>
              </div>
            )}
            {tablatureFile && (
              <div className="flex justify-center gap-2">
                <Badge variant="outline">Uploaded File</Badge>
                <Badge variant="secondary">{tablatureFile.fileName}</Badge>
              </div>
            )}
          </div>

          {/* Tablature Display */}
          <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5" />
                Tablature
              </CardTitle>
              <CardDescription>
                {tablature?.description || 'Uploaded tablature content'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[60vh] w-full">
                <div className="p-6 bg-gray-50">
                  <div className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
                    {tablature?.asciiContent || tablatureFile?.content}
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4 flex-wrap">
              <Button onClick={downloadTablature} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download Tablature
              </Button>
              <Button asChild variant="outline">
                <Link href="/tab/editor">
                  <FileText className="mr-2 h-4 w-4" />
                  Open Editor
                </Link>
              </Button>
              {!tablatureFile && (
                <Button 
                  onClick={() => document.getElementById('file-upload')?.click()} 
                  variant="outline"
                  disabled={isLoading}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  {isLoading ? 'Loading...' : 'Upload New File'}
                </Button>
              )}
              <input
                id="file-upload"
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </CardContent>
          </Card>
        </div>
      </main>
      <AppFooter />
    </div>
  );
} 