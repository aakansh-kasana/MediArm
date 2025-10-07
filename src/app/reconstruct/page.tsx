'use client';

import { useState } from 'react';
import { ReconstructionForm } from '@/components/reconstruction-form';
import { createReconstruction } from '@/actions/reconstruction';
import { ModelViewer } from '@/components/model-viewer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileJson, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ResultState = {
  modelDataUri: string;
  summary: string;
};

export default function ReconstructPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [result, setResult] = useState<ResultState | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (data: {
    images: string[];
    patientHistory: string;
    radiologistNotes: string;
  }) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    setStatusText('Uploading images...');
    setProgress(25);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 5 : 90));
    }, 500);

    setStatusText('Generating 3D model...');
    const response = await createReconstruction(data);

    clearInterval(progressInterval);
    setProgress(100);

    if (response.success && response.modelDataUri && response.summary) {
      setResult({ modelDataUri: response.modelDataUri, summary: response.summary });
      setStatusText('Reconstruction complete!');
    } else {
      setError(response.error || 'An unknown error occurred.');
      setStatusText('Failed to generate model.');
    }
    setIsLoading(false);
  };
  
  const handleExport = () => {
    if (!result) return;
    const dataStr = JSON.stringify({
        summary: result.summary,
        generatedAt: new Date().toISOString(),
    }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'reconstruction_metadata.json');
    linkElement.click();
  }

  return (
    <div className="container py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-8">
          <ReconstructionForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          {isLoading && (
            <Card>
              <CardHeader>
                <CardTitle>Processing Request</CardTitle>
                <CardDescription>{statusText}</CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={progress} className="w-full" />
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-8">
          {error && (
             <Alert variant="destructive">
               <AlertCircle className="h-4 w-4" />
               <AlertTitle>Error</AlertTitle>
               <AlertDescription>{error}</AlertDescription>
             </Alert>
          )}

          {result ? (
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Interactive 3D Model</CardTitle>
                </CardHeader>
                <CardContent>
                  <ModelViewer modelDataUri={result.modelDataUri} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <CardTitle>Medical Report Summary</CardTitle>
                    <CardDescription>AI-generated key findings.</CardDescription>
                  </div>
                   <Button variant="outline" size="sm" onClick={handleExport}>
                     <FileJson className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{result.summary}</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex h-full min-h-[500px] items-center justify-center rounded-lg border border-dashed">
                <div className="text-center">
                    <h3 className="text-lg font-semibold">Your 3D Model Will Appear Here</h3>
                    <p className="text-sm text-muted-foreground">Submit the form to begin reconstruction.</p>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
