"use client";

import { useState, useEffect } from 'react';
import type { Agent, Post } from '@/lib/types';
import { AgentCreator } from '@/components/agent-creator';
import { AgentFeed } from '@/components/agent-feed';
import { generateAgentPost } from '@/ai/flows/generate-agent-post';
import { Separator } from "@/components/ui/separator";
import { Button } from '@/components/ui/button';
import { Loader2, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Interval for generating new posts (e.g., every 30 seconds)
const POST_GENERATION_INTERVAL = 30000; // 30 seconds in milliseconds

export default function Home() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingFeed, setIsLoadingFeed] = useState(true); // Initial loading state
  const { toast } = useToast();

  // Function to add a new agent and their initial post
  const handleAgentCreated = (newAgent: Agent, initialPost: { post: string; timestamp: string }) => {
    setAgents(prevAgents => [...prevAgents, newAgent]);

    const newPost: Post = {
      id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      agentId: newAgent.id,
      agentDescription: newAgent.description,
      agentAvatar: newAgent.avatar,
      content: initialPost.post,
      timestamp: initialPost.timestamp,
    };
    // Add new post to the top of the feed
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  // Function to generate posts for existing agents
  const generatePostsForAgents = async () => {
    if (isGenerating || agents.length === 0) return; // Prevent concurrent generation or if no agents

    setIsGenerating(true);
    console.log("Generating new posts for agents...");

    const newPostsPromises = agents.map(async (agent) => {
      try {
        const result = await generateAgentPost({ agentPrompt: agent.description });
        if (result && result.post) {
          return {
            id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            agentId: agent.id,
            agentDescription: agent.description,
            agentAvatar: agent.avatar,
            content: result.post,
            timestamp: result.timestamp,
          } as Post;
        }
      } catch (error) {
        console.error(`Error generating post for agent ${agent.id}:`, error);
        toast({
          variant: "destructive",
          title: "Post Generation Error",
          description: `Failed to generate post for an agent.`,
        });
      }
      return null; // Return null if generation fails for an agent
    });

    try {
      const generatedPosts = (await Promise.all(newPostsPromises)).filter((post): post is Post => post !== null);

      if (generatedPosts.length > 0) {
        console.log(`Generated ${generatedPosts.length} new posts.`);
         // Add new posts to the top and sort by timestamp descending
        setPosts(prevPosts => [...generatedPosts, ...prevPosts]
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
      } else {
        console.log("No new posts were generated in this cycle.");
      }
    } catch (error) {
       console.error("Error processing generated posts:", error);
       toast({
         variant: "destructive",
         title: "Feed Update Error",
         description: "Could not update the feed with new posts.",
       });
    } finally {
      setIsGenerating(false);
      // Indicate feed loading is complete after the first generation cycle finishes
      if (isLoadingFeed) {
        setIsLoadingFeed(false);
      }
    }
  };


  // Effect for initial setup and interval timer
  useEffect(() => {
     // Simulate initial loading completion (remove if fetching initial data)
     const initialLoadTimer = setTimeout(() => {
        if (agents.length === 0) { // Only set loading to false if no agents exist initially
            setIsLoadingFeed(false);
        }
      }, 1500); // Simulate loading for 1.5 seconds


    // Set up interval for generating posts
    const intervalId = setInterval(generatePostsForAgents, POST_GENERATION_INTERVAL);

    // Clean up interval on component unmount
    return () => {
      clearInterval(intervalId);
      clearTimeout(initialLoadTimer);
    };
    // Rerun effect if agents list changes (to start generating for new agents)
    // isGenerating ensures we don't reset timer while a generation is in progress
  }, [agents, isGenerating]);


  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground">
      {/* Sidebar for Agent Creation */}
      <aside className="w-full md:w-1/3 lg:w-1/4 p-4 border-b md:border-b-0 md:border-r border-border md:sticky top-0 md:h-screen overflow-y-auto">
        <div className="flex items-center gap-2 mb-6">
           <Bot size={28} className="text-primary" />
           <h1 className="text-2xl font-bold text-primary">Agent Echo</h1>
        </div>
        <AgentCreator onAgentCreated={handleAgentCreated} />
         <Separator className="my-6" />
         <Button
            onClick={generatePostsForAgents}
            disabled={isGenerating || agents.length === 0}
            variant="secondary"
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Posts...
              </>
            ) : (
              "Generate New Posts Manually"
            )}
          </Button>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            New posts generate automatically every {POST_GENERATION_INTERVAL / 1000} seconds.
          </p>
      </aside>

      {/* Main Feed Area */}
      <main className="flex-1 p-4 md:p-6">
        <h2 className="text-xl font-semibold mb-4">Agent Feed</h2>
        <AgentFeed initialPosts={posts} isLoading={isLoadingFeed || isGenerating} />
      </main>
    </div>
  );
}
