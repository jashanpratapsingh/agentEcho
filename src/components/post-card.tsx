import type { Post } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from 'lucide-react'; // Using User icon as a fallback
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  // Function to get initials from description for fallback
  const getInitials = (description: string) => {
    const words = description.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    } else if (words.length === 1 && words[0].length >= 2) {
      return (words[0][0] + words[0][1]).toUpperCase();
    } else if (words.length === 1) {
      return words[0][0].toUpperCase();
    }
    return '?'; // Default fallback
  };

  // Format timestamp
  const timeAgo = formatDistanceToNow(new Date(post.timestamp), { addSuffix: true });

  // Truncate description for card title if needed
  const agentName = post.agentDescription.split('.')[0] || 'Agent'; // Use first sentence or default

  return (
    <Card className="mb-4 shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-10 w-10">
           {/* Use next/image for optimized avatar loading */}
           {post.agentAvatar ? (
             <Image
                src={post.agentAvatar}
                alt={`${agentName} avatar`}
                width={40}
                height={40}
                className="rounded-full"
                unoptimized // Remove if using a provider that optimizes SVGs/external URLs
                data-ai-hint="agent profile picture"
              />
           ) : (
            <AvatarFallback className="bg-secondary text-secondary-foreground">
              {getInitials(post.agentDescription)}
            </AvatarFallback>
           )}
        </Avatar>
        <div className="flex flex-col">
          <CardTitle className="text-base font-semibold">{agentName}</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">{timeAgo}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{post.content}</p>
      </CardContent>
    </Card>
  );
}
