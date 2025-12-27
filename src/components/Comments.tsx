import { useState, useEffect, useCallback } from 'react';
import { MessageCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
}

interface CommentsProps {
  contentId: string;
  contentType: 'blog' | 'podcast';
}

const Comments = ({ contentId }: CommentsProps) => {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadComments = useCallback(() => {
    const allComments = JSON.parse(localStorage.getItem('content_comments') || '{}');
    const contentComments = allComments[contentId] || [];
    setComments(contentComments);
  }, [contentId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: 'Login required',
        description: 'Please login to comment.',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    if (!newComment.trim()) {
      toast({
        title: 'Empty comment',
        description: 'Please write something before submitting.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const comment: Comment = {
        id: Date.now().toString(),
        userId: user!.id,
        userName: user!.name,
        text: newComment.trim(),
        timestamp: new Date().toISOString()
      };

      const allComments = JSON.parse(localStorage.getItem('content_comments') || '{}');
      const contentComments = allComments[contentId] || [];
      contentComments.unshift(comment);
      allComments[contentId] = contentComments;
      localStorage.setItem('content_comments', JSON.stringify(allComments));

      setComments(contentComments);
      setNewComment('');
      
      toast({
        title: 'Comment posted!',
        description: 'Your comment has been added.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to post comment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (commentId: string) => {
    const allComments = JSON.parse(localStorage.getItem('content_comments') || '{}');
    const contentComments = allComments[contentId] || [];
    const updatedComments = contentComments.filter((c: Comment) => c.id !== commentId);
    allComments[contentId] = updatedComments;
    localStorage.setItem('content_comments', JSON.stringify(allComments));
    
    setComments(updatedComments);
    toast({
      title: 'Comment deleted',
      description: 'Your comment has been removed.',
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      }
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <MessageCircle className="h-5 w-5" />
        <h3 className="text-xl font-semibold">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder={isAuthenticated ? "Share your thoughts..." : "Please login to comment"}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={!isAuthenticated || isSubmitting}
          rows={4}
          className="w-full"
        />
        <div className="flex justify-between items-center">
          {!isAuthenticated ? (
            <p className="text-sm text-muted-foreground">
              Please <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/login')}>login</Button> to leave a comment.
            </p>
          ) : (
            <div />
          )}
          <Button 
            type="submit" 
            disabled={!isAuthenticated || isSubmitting || !newComment.trim()}
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </Button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>
                      {comment.userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{comment.userName}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(comment.timestamp)}
                    </p>
                  </div>
                </div>
                {user?.id === comment.userId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(comment.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <p className="text-foreground whitespace-pre-wrap">{comment.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;
