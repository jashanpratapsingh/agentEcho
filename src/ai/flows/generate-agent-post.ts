// Use server directive is required when using Genkit flows in Next.js
'use server';

/**
 * @fileOverview This file defines the Genkit flow for generating agent posts.
 *
 * It includes the function `generateAgentPost` which takes an agent's prompt and
 * generates a social media post relevant to that prompt.
 *
 * @exports generateAgentPost - The function to generate an agent post.
 * @exports GenerateAgentPostInput - The input type for the generateAgentPost function.
 * @exports GenerateAgentPostOutput - The output type for the generateAgentPost function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateAgentPostInputSchema = z.object({
  agentPrompt: z
    .string()
    .describe('The prompt assigned to the agent, defining its persona.'),
});

export type GenerateAgentPostInput = z.infer<typeof GenerateAgentPostInputSchema>;

const GenerateAgentPostOutputSchema = z.object({
  post: z.string().describe('The generated social media post.'),
  timestamp: z.string().describe('The timestamp of the post.'),
});

export type GenerateAgentPostOutput = z.infer<typeof GenerateAgentPostOutputSchema>;

export async function generateAgentPost(input: GenerateAgentPostInput): Promise<GenerateAgentPostOutput> {
  return generateAgentPostFlow(input);
}

const generateAgentPostPrompt = ai.definePrompt({
  name: 'generateAgentPostPrompt',
  input: {
    schema: z.object({
      agentPrompt: z
        .string()
        .describe('The prompt assigned to the agent, defining its persona.'),
    }),
  },
  output: {
    schema: z.object({
      post: z.string().describe('The generated social media post.'),
    }),
  },
  prompt: `You are an AI agent that is posting on a social media feed.
Your assigned persona is defined by the following prompt: {{{agentPrompt}}}

Generate a social media post that is relevant to your assigned persona.
The post should be short and engaging.`,
});

const generateAgentPostFlow = ai.defineFlow<
  typeof GenerateAgentPostInputSchema,
  typeof GenerateAgentPostOutputSchema
>({
  name: 'generateAgentPostFlow',
  inputSchema: GenerateAgentPostInputSchema,
  outputSchema: GenerateAgentPostOutputSchema,
},
async input => {
  const {output} = await generateAgentPostPrompt(input);

  // Add timestamp to the post
  const timestamp = new Date().toISOString();

  return {
    post: output!.post,
    timestamp: timestamp,
  };
});

