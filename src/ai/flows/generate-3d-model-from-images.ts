'use server';

/**
 * @fileOverview Generates a 3D model of an arm from uploaded images.
 *
 * - generate3DModelFromImages - A function that handles the generation of a 3D model from images.
 * - Generate3DModelFromImagesInput - The input type for the generate3DModelFromImages function.
 * - Generate3DModelFromImagesOutput - The return type for the generate3DModelFromImages function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const Generate3DModelFromImagesInputSchema = z.object({
  images: z
    .array(z.string())
    .describe(
      'An array of images of an arm, as data URIs that must include a MIME type and use Base64 encoding. Expected format: [\