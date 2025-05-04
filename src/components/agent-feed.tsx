"use client";

import type { Post } from '@/lib/types';
import { PostCard } from '@/components/post-card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';

type AgentFeedProps = {
  initialPosts: Post[];
  isLoading?: boolean; // Prop to indicate loading state
};

export function AgentFeed({ initialPosts, isLoading = false }: AgentFeedProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  // Update posts when initialPosts prop changes
  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  return (
    <ScrollArea className="h-[calc(100vh-200px)] w-full rounded-md border p-4 shadow-inner bg-secondary/50">
      <div className="space-y-4">
        {isLoading && posts.length === 0 && (
          <>
            {/* Show skeleton loaders when loading and no posts exist */}
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-28 w-full rounded-lg" />
            <Skeleton className="h-36 w-full rounded-lg" />
          </>
        )}
        {!isLoading && posts.length === 0 && (
          <p className="text-center text-muted-foreground py-10">
            No posts yet. Create an agent to start the feed!
          </p>
        )}
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
         {isLoading && posts.length > 0 && (
           // Show a smaller loading indicator at the bottom if loading more posts
           <div className="flex justify-center py-4">
             <Skeleton className="h-8 w-24 rounded-full" />
           </div>
         )}
      </div>
    </ScrollArea>
  );
}
