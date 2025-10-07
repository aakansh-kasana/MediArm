'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUp, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type ReconstructionFormProps = {
  onSubmit: (data: { images: string[]; patientHistory: string; radiologistNotes: string }) => void;
  isLoading: boolean;
};

export function ReconstructionForm({ onSubmit, isLoading }: ReconstructionFormProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [patientHistory, setPatientHistory] = useState('');
  const [radiologistNotes, setRadiologistNotes] = useState('');
  const { toast } = useToast();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const convertFilesToBase64 = (files: File[]): Promise<string[]> => {
    const promises = files.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });
    });
    return Promise.all(promises);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No Images Selected',
        description: 'Please upload at least one image of the arm.',
      });
      return;
    }
    const imageStrings = await convertFilesToBase64(files);
    onSubmit({
      images: imageStrings,
      patientHistory,
      radiologistNotes,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create New Reconstruction</CardTitle>
        <CardDescription>Upload images and provide patient details to generate a 3D model.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="picture">Arm Images</Label>
            <div className="relative">
              <Input id="picture" type="file" multiple onChange={handleFileChange} className="pl-12" />
              <FileUp className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
            {files.length > 0 && <p className="text-sm text-muted-foreground">{files.length} file(s) selected.</p>}
          </div>

          <div className="grid w-full gap-2">
            <Label htmlFor="patientHistory">Patient History</Label>
            <Textarea
              id="patientHistory"
              placeholder="e.g., 45-year-old male, history of fractures..."
              value={patientHistory}
              onChange={(e) => setPatientHistory(e.target.value)}
            />
          </div>

          <div className="grid w-full gap-2">
            <Label htmlFor="radiologistNotes">Radiologist Notes</Label>
            <Textarea
              id="radiologistNotes"
              placeholder="e.g., Scan shows potential tissue damage near the elbow..."
              value={radiologistNotes}
              onChange={(e) => setRadiologistNotes(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Processing...' : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Generate Model
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
