
import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/app-footer';
import { tablatures as allTablatures, TablatureItem } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function TablaturePage({ params }: { params: { tabId: string } }) {
  const tab = allTablatures.find((t: TablatureItem) => t.id === params.tabId);

  if (!tab) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
        <AppHeader />
        <main className="flex-grow container mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold mb-4 text-destructive">Tablature Not Found</h1>
          <p className="text-lg text-muted-foreground mb-8">Sorry, we couldn't find the tablature you were looking for.</p>
          <Button asChild>
            <Link href="/showcase?section=guitar"> {/* Updated Link */}
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Guitar Videos
            </Link>
          </Button>
        </main>
        <AppFooter />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <AppHeader />
      <main className="flex-grow container mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button asChild variant="outline" size="sm">
            <Link href="/showcase?section=guitar"> {/* Updated Link */}
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Guitar Videos
            </Link>
          </Button>
        </div>
        <Card className="w-full shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl sm:text-4xl font-headline">{tab.title}</CardTitle>
            <CardDescription className="text-md sm:text-lg text-muted-foreground">
              Artist: {tab.artist} | Difficulty: {tab.difficulty}
            </CardDescription>
            {tab.description && <p className="text-sm text-foreground pt-2">{tab.description}</p>}
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[60vh] w-full p-1 rounded-md border bg-muted/30">
              <pre className="text-sm font-code p-4 whitespace-pre-wrap break-words leading-relaxed">
                {tab.asciiContent}
              </pre>
            </ScrollArea>
          </CardContent>
        </Card>
      </main>
      <AppFooter />
    </div>
  );
}
