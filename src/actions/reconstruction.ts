'use server';

import { summarizeMedicalReport } from '@/ai/flows/summarize-medical-report';
import { generate3DModelFromImages } from '@/ai/flows/generate-3d-model-from-images';
import { z } from 'zod';

const reconstructionInputSchema = z.object({
  images: z.array(z.string()),
  patientHistory: z.string(),
  radiologistNotes: z.string(),
});


export async function createReconstruction(input: z.infer<typeof reconstructionInputSchema>) {
  try {
    const validatedInput = reconstructionInputSchema.parse(input);

    // Step 1: Generate the 3D model from images.
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
