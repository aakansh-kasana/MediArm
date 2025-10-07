'use server';

import { summarizeMedicalReport } from '@/ai/flows/summarize-medical-report';
import { MOCK_ARM_MODEL_URI } from '@/lib/mock-model';
import { z } from 'zod';

const reconstructionInputSchema = z.object({
  images: z.array(z.string()),
  patientHistory: z.string(),
  radiologistNotes: z.string(),
});

// This is a mock function. The file `src/ai/flows/generate-3d-model-from-images.ts`
// is incomplete in the user's project. In a real scenario, you would import and use
// the actual function from that file.
async function generate3DModelFromImages(input: { images: string[] }): Promise<{ modelDataUri: string }> {
  console.log('Mock generating 3D model from', input.images.length, 'images.');
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Return a mock model URI.
  // Using the placeholder URI as the full one is too large for this context.
  return { modelDataUri: MOCK_ARM_MODEL_URI };
}


export async function createReconstruction(input: z.infer<typeof reconstructionInputSchema>) {
  try {
    const validatedInput = reconstructionInputSchema.parse(input);

    // Step 1: Generate the 3D model from images.
    // Replace this with the actual AI flow when available.
    const modelResult = await generate3DModelFromImages({ images: validatedInput.images });

    if (!modelResult.modelDataUri) {
      throw new Error('Failed to generate 3D model.');
    }

    // Step 2: Summarize the findings.
    const summaryResult = await summarizeMedicalReport({
      modelDataUri: modelResult.modelDataUri,
      patientHistory: validatedInput.patientHistory,
      radiologistNotes: validatedInput.radiologistNotes,
    });
    
    if (!summaryResult.summary) {
        throw new Error('Failed to generate medical summary.');
    }
    
    // In a real application, you would save the model and summary to Firestore/Storage here.

    return {
      success: true,
      modelDataUri: modelResult.modelDataUri,
      summary: summaryResult.summary,
    };
  } catch (error) {
    console.error('Reconstruction failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      success: false,
      error: errorMessage,
    };
  }
}
