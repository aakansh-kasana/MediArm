'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { exec } from 'child-process-promise';
import * as fs from 'fs';
import * as path from 'path';

const Generate3DModelFromImagesInputSchema = z.object({
  images: z
    .array(z.string())
    .describe(
      'An array of images of an arm, as data URIs that must include a MIME type and use Base64 encoding. Expected format: [\'data:<mimetype>;base64,<encoded_data>\']'
    ),
});
export type Generate3DModelFromImagesInput = z.infer<typeof Generate3DModelFromImagesInputSchema>;


const Generate3DModelFromImagesOutputSchema = z.object({
  modelDataUri: z
    .string()
    .describe(
      "A 3D model of an arm, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type Generate3DModelFromImagesOutput = z.infer<typeof Generate3DModelFromImagesOutputSchema>;


export async function generate3DModelFromImages(input: Generate3DModelFromImagesInput): Promise<Generate3DModelFromImagesOutput> {
  return generate3DModelFromImagesFlow(input);
}


const generate3DModelFromImagesFlow = ai.defineFlow(
  {
    name: 'generate3DModelFromImagesFlow',
    inputSchema: Generate3DModelFromImagesInputSchema,
    outputSchema: Generate3DModelFromImagesOutputSchema,
  },
  async (input) => {
    const image = input.images[0]; // For now, we only use the first image
    const data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(data, 'base64');
    const inputPath = path.join('/tmp', 'input.png');
    const outputPath = path.join('/tmp', 'output.obj');

    fs.writeFileSync(inputPath, buffer);

    try {
      await exec(`./pifuhd/run_pifuhd.py ${inputPath} ${outputPath}`);
      const modelData = fs.readFileSync(outputPath, 'base64');
      const modelDataUri = `data:application/octet-stream;base64,${modelData}`;
      return { modelDataUri };
    } catch (error) {
      console.error('Error generating 3D model:', error);
      throw error;
    }
  }
);
