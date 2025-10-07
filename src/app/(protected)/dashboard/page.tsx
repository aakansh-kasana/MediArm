'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import { PlusCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

// Mock data, replace with Firestore call
const mockReconstructions = [
  {
    id: 'rec_1',
    patientId: 'P-001',
    date: '2024-07-21',
    status: 'Completed',
    thumbnail: 'https://picsum.photos/seed/1/200/150',
    thumbnailHint: '3d model'
  },
  {
    id: 'rec_2',
    patientId: 'P-002',
    date: '2024-07-20',
    status: 'Completed',
    thumbnail: 'https://picsum.photos/seed/2/200/150',
    thumbnailHint: 'arm scan'
  },
  {
    id: 'rec_3',
    patientId: 'P-003',
    date: '2024-07-19',
    status: 'Failed',
    thumbnail: 'https://picsum.photos/seed/3/200/150',
    thumbnailHint: 'x-ray'
  },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user?.displayName || 'Doctor'}!</h1>
          <p className="text-muted-foreground">Here are your recent arm reconstructions.</p>
        </div>
        <Button asChild>
          <Link href="/reconstruct">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Reconstruction
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockReconstructions.map((rec) => (
          <Card key={rec.id}>
            <CardHeader>
              <Image
                src={rec.thumbnail}
                alt={`Reconstruction for ${rec.patientId}`}
                width={400}
                height={200}
                data-ai-hint={rec.thumbnailHint}
                className="rounded-lg object-cover aspect-[4/3]"
              />
            </CardHeader>
            <CardContent>
              <CardTitle>Patient ID: {rec.patientId}</CardTitle>
              <CardDescription>Date: {new Date(rec.date).toLocaleDateString()}</CardDescription>
              <Badge
                variant={rec.status === 'Completed' ? 'default' : 'destructive'}
                className={`mt-2 ${rec.status === 'Completed' ? 'bg-green-600' : ''}`}
              >
                {rec.status}
              </Badge>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
        {mockReconstructions.length === 0 && (
          <div className="col-span-full text-center py-12">
            <h3 className="text-xl font-semibold">No reconstructions yet.</h3>
            <p className="text-muted-foreground mt-2">Start by creating a new one.</p>
          </div>
        )}
      </div>
    </div>
  );
}
