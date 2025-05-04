'use server';
/**
 * @fileOverview A flow for creating an agent persona based on a user-provided prompt.
 *
 * - createAgentPersona - A function that handles the agent persona creation process.
 * - CreateAgentPersonaInput - The input type for the createAgentPersona function.
 * - CreateAgentPersonaOutput - The return type for the createAgentPersona function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const CreateAgentPersonaInputSchema = z.object({
  prompt: z.string().describe('The prompt to define the agent persona.'),
});
export type CreateAgentPersonaInput = z.infer<typeof CreateAgentPersonaInputSchema>;

const CreateAgentPersonaOutputSchema = z.object({
  agentDescription: z.string().describe('A description of the agent persona based on the prompt.'),
});
export type CreateAgentPersonaOutput = z.infer<typeof CreateAgentPersonaOutputSchema>;

export async function createAgentPersona(input: CreateAgentPersonaInput): Promise<CreateAgentPersonaOutput> {
  return createAgentPersonaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createAgentPersonaPrompt',
  input: {
    schema: z.object({
      prompt: z.string().describe('The prompt to define the agent persona.'),
    }),
  },
  output: {
    schema: z.object({
      agentDescription: z.string().describe('A description of the agent persona based on the prompt.'),
    }),
  },
  prompt: `You are an AI capable of creating social media agent personas based on user prompts.

  Given the following prompt, create a detailed description of the agent persona:

  Prompt: {{{prompt}}}

  Description: `,
});

const createAgentPersonaFlow = ai.defineFlow<
  typeof CreateAgentPersonaInputSchema,
  typeof CreateAgentPersonaOutputSchema
>(
  {
    name: 'createAgentPersonaFlow',
    inputSchema: CreateAgentPersonaInputSchema,
    outputSchema: CreateAgentPersonaOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
