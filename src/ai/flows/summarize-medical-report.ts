'use server';
/**
 * @fileOverview Summarizes key findings from the 3D model reconstruction into a concise medical report.
 *
 * - summarizeMedicalReport - A function that handles the summarization process.
 * - SummarizeMedicalReportInput - The input type for the summarizeMedicalReport function.
 * - SummarizeMedicalReportOutput - The return type for the summarizeMedicalReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeMedicalReportInputSchema = z.object({
  modelDataUri: z
    .string()
    .describe(
      "A 3D model of an arm, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  patientHistory: z.string().describe('The medical history of the patient.'),
  radiologistNotes: z.string().describe('Notes from the radiologist about the scan.'),
});
export type SummarizeMedicalReportInput = z.infer<typeof SummarizeMedicalReportInputSchema>;

const SummarizeMedicalReportOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the key findings from the 3D model reconstruction.'),
});
export type SummarizeMedicalReportOutput = z.infer<typeof SummarizeMedicalReportOutputSchema>;

export async function summarizeMedicalReport(input: SummarizeMedicalReportInput): Promise<SummarizeMedicalReportOutput> {
  return summarizeMedicalReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeMedicalReportPrompt',
  input: {schema: SummarizeMedicalReportInputSchema},
  output: {schema: SummarizeMedicalReportOutputSchema},
  prompt: `You are an expert medical summarizer. You will receive a 3D model of an arm, the patient\'s medical history, and notes from the radiologist.

Your task is to summarize the key findings from the 3D model reconstruction into a concise medical report, so the doctor can quickly understand the important aspects without manually analyzing the model.

Patient History: {{{patientHistory}}}
Radiologist Notes: {{{radiologistNotes}}}
3D Model: {{media url=modelDataUri}}

Summary: `,
});

const summarizeMedicalReportFlow = ai.defineFlow(
  {
    name: 'summarizeMedicalReportFlow',
    inputSchema: SummarizeMedicalReportInputSchema,
    outputSchema: SummarizeMedicalReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
