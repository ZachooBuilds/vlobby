'use client';

import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { Badge } from '@tremor/react';
import { Trash } from 'lucide-react';
import { GlobalNoteData } from './global-note-form';
import { useToast } from '@repo/ui/hooks/use-toast';
import { api } from '@repo/backend/convex/_generated/api';
import { Id } from '@repo/backend/convex/_generated/dataModel';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@repo/ui/components/ui/card';
import { Avatar, AvatarFallback } from '@repo/ui/components/ui/avatar';
import { Button } from '@repo/ui/components/ui/button';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { Textarea } from '@repo/ui/components/ui/textarea';
import ImageGalleryComponent from '../../../_components/image-gallery';

/**
 * @interface GlobalNoteCommentData
 * @description Defines the structure of a comment object
 */
interface GlobalNoteCommentData {
  _id: string;
  author: string;
  comment: string;
  _creationTime: number;
}

/**
 * @function GlobalNote
 * @description Renders a single note with author details, content, and attached files
 * @param {GlobalNoteData} props - The note data
 * @returns {JSX.Element} The rendered GlobalNote component
 */
const GlobalNote = ({
  _id,
  author,
  content,
  isPrivate,
  _creationTime,
  files,
  noteType,
}: GlobalNoteData) => {
  const [newComment, setNewComment] = useState('');
  const { toast } = useToast();
  const deleteNote = useMutation(api.notes.deleteGlobalNote);
  const addComment = useMutation(api.notes.addComment);
  const getComments = useQuery(api.notes.getComments, {
    noteId: _id as Id<'globalNotes'>,
  }) as GlobalNoteCommentData[];

  /**
   * @function handleAddComment
   * @description Handles adding a new comment to the note
   * @todo Implement comment functionality
   */
  const handleAddComment = async () => {
    // TODO: Implement comment addition logic
    try {
      await addComment({
        noteId: _id as Id<'globalNotes'>,
        comment: newComment,
      });
      setNewComment('');
      toast({
        title: 'Comment added',
        description: 'Your comment has been successfully added.',
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to add your comment. Please try again.',
        variant: 'destructive',
      });
    }
  };

  /**
   * @function handleDeleteNote
   * @description Handles adding a new comment to the note
   * @todo Implement comment functionality
   */
  const handleDeleteNote = async () => {
    try {
      await deleteNote({ id: _id as Id<'globalNotes'> });
      toast({
        title: 'Note deleted',
        description: 'The note has been successfully deleted.',
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete the note. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <Badge size={'xs'} color={isPrivate ? 'gray' : 'green'}>
          {isPrivate ? 'Private' : 'Public'}
        </Badge>
        <div className="flex items-center justify-between">
          {/* Author information */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarFallback>
                {author
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{author}</div>
              <div className="text-sm text-muted-foreground">
                {new Date(_creationTime).toLocaleString()}
              </div>
            </div>
          </div>
          <Button variant={'outline'} onClick={handleDeleteNote}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Note content */}
        <p className="whitespace-pre-wrap">{content}</p>
        {/* Attached files (if any) */}
        {files && files.length > 0 && (
          <div className="mt-4">
            <ImageGalleryComponent images={files.map((file) => file.url)} />
          </div>
        )}
      </CardContent>
      <Separator className="my-4" />
      {/* Comment section */}
      {getComments && getComments.length > 0 && (
        <div className="flex flex-col gap-2 p-4">
          {getComments.map((comment) => (
            <div
              key={comment._id}
              className="flex flex-row items-start justify-start gap-8 p-2"
            >
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback>
                  {comment.author
                    .split(' ')
                    .map((n: string) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex w-full flex-col items-start justify-start gap-2">
                <div className="gap- flex w-full flex-row items-start justify-between">
                  <div className="font-medium">{comment.author}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(comment._creationTime).toLocaleString()}
                  </div>
                </div>
                <p>{comment.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <CardFooter>
        <div className="flex w-full items-center space-x-4">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarFallback>{'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <Textarea
              placeholder="Write a comment..."
              className="w-full resize-none"
              rows={1}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
          </div>
          <Button
            size="sm"
            className="flex-shrink-0"
            onClick={handleAddComment}
          >
            Post
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default GlobalNote;
