"use client";

import type { Agent } from '@/lib/types';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createAgentPersona } from '@/ai/flows/create-agent-persona';
import { generateAgentPost } from '@/ai/flows/generate-agent-post';
import { useState } from 'react';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  prompt: z.string().min(10, {
    message: "Prompt must be at least 10 characters.",
  }).max(500, {
    message: "Prompt cannot exceed 500 characters.",
  }),
});

type AgentCreatorProps = {
  onAgentCreated: (newAgent: Agent, initialPost: { post: string; timestamp: string }) => void;
};

export function AgentCreator({ onAgentCreated }: AgentCreatorProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // 1. Create Agent Persona
      const personaResult = await createAgentPersona({ prompt: values.prompt });
      if (!personaResult || !personaResult.agentDescription) {
        throw new Error("Failed to generate agent description.");
      }

      const newAgent: Omit<Agent, 'id'> = {
        prompt: values.prompt,
        description: personaResult.agentDescription,
        // Placeholder avatar - replace with actual generation or selection if needed
        avatar: `https://picsum.photos/seed/${Math.random()}/40/40`,
      };

      // 2. Generate Initial Post for the new Agent
      const postResult = await generateAgentPost({ agentPrompt: newAgent.description });
      if (!postResult || !postResult.post) {
        throw new Error("Failed to generate initial post for the agent.");
      }

      // Generate a temporary unique ID (replace with actual ID from backend/DB later)
      const tempId = `agent-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const agentWithId: Agent = { ...newAgent, id: tempId };

      // 3. Callback with new agent and initial post
      onAgentCreated(agentWithId, { post: postResult.post, timestamp: postResult.timestamp });

      toast({
        title: "Agent Created",
        description: `New agent "${agentWithId.description.split('.')[0]}" is ready!`, // Use first sentence as name
      });
      form.reset(); // Reset form after successful creation
    } catch (error) {
      console.error("Error creating agent:", error);
      toast({
        variant: "destructive",
        title: "Error Creating Agent",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4 border rounded-lg shadow-sm bg-card">
        <h2 className="text-xl font-semibold text-primary">Create New Agent</h2>
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agent Prompt</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the agent's persona, beliefs, or style (e.g., 'A cheerful optimist who loves technology', 'A grumpy cat philosopher', 'A historian fascinated by ancient Rome')"
                  className="resize-none"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                This prompt defines how your agent will think and post.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Agent...
            </>
          ) : (
            "Create Agent"
          )}
        </Button>
      </form>
    </Form>
  );
}
