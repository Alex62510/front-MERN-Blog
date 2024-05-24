import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button, Textarea } from 'flowbite-react';
import { Comment } from './Comment';
import { CommentType } from '../types/types';

type Props = {
  postId: string;
};
export const CommentSection = ({ postId }: Props) => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<CommentType[]>([]);
  const [commentError, setCommentError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (comment.length > 200) {
      return;
    }
    try {
      if (currentUser) {
        setCommentError('');
        const res = await fetch('/api/comment/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: comment,
            postId,
            userId: currentUser._id,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          setComment('');
          setComments([data, ...comments]);
          setCommentError('');
        } else {
          setCommentError(data.message);
        }
      }
    } catch (e) {
      setCommentError((e as Error).message);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getPostComments/${postId}`);
        const data = await res.json();
        if (res.ok) {
          setComments(data);
        }
      } catch (e) {
        console.log(e);
      }
    };
    getComments();
  }, [postId]);

  const handleLike = async (commentId: string) => {
    try {
      if (!currentUser) {
        navigate('/sign-in');
        return;
      }
      const res = await fetch(`/api/comment/likeComments/${commentId}`, {
        method: 'PUT',
      });
      if (res.ok) {
        const data = await res.json();
        setComments(
          comments.map(comment =>
            commentId === comment._id
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : comment,
          ),
        );
      }
    } catch (e) {
      console.log((e as Error).message);
    }
  };
  const handleEdit = async (commentId: string, editedContent: string) => {
    setComments(
      comments.map(c => (c._id === commentId ? { ...c, content: editedContent } : c)),
    );
  };
  const handleChangeContent = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCommentError('');
    setComment(e.target.value);
  };
  const handleDelete = async (commentId: string) => {
    try {
      if (!currentUser) {
        navigate('/sign-in');
        return;
      }
      const res = await fetch(`/api/comment/deleteComments/${commentId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        setComments(comments.filter(comment => comment._id !== commentId));
      } else {
        setCommentError(data.message);
      }
    } catch (e) {
      console.log((e as Error).message);
    }
  };

  return (
    <div className={'max-w-2xl mx-auto w-full p-3'}>
      {currentUser ? (
        <div className={'flex items-center gap-1 my-5 text-gray-500 text-sm'}>
          <p>Signed as:</p>
          <img
            src={currentUser.profilePicture}
            alt=""
            className={'w-6 h-6 object-cover rounded-full'}
          />
          <Link
            to={'/dashboard?tab=profile'}
            className={'text-xs text-cyan-500 hover:underline hover:text-cyan-700'}
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className={'text-sm  my-5 flex gap-1 dark:text-teal-100'}>
          You must be signed in to comment.
          <Link to={'/sign-in'} className={'text-cyan-500 hover:underline'}>
            Sign in
          </Link>
        </div>
      )}
      {currentUser && (
        <form className={'border border-teal-500 p-4 rounded-md'} onSubmit={handleSubmit}>
          <Textarea
            placeholder={'Add a comment...'}
            rows={3}
            maxLength={200}
            onChange={handleChangeContent}
            value={comment}
          ></Textarea>
          <div className={'flex justify-between items-center mt-5'}>
            <p className={'text-gray-500 text-xs'}>
              {200 - comment.length} characters remaining
            </p>
            <Button
              className={'hover:animate-pulse transition'}
              type={'submit'}
              gradientDuoTone={'purpleToBlue'}
              outline
            >
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert color={'failure'} className={'mt-5'}>
              {commentError && commentError}
            </Alert>
          )}
        </form>
      )}
      {comments.length === 0 ? (
        <p className={'text-sm my-5'}>No comments yet!</p>
      ) : (
        <>
          <div className={'text-sm my-5 flex items-center gap-1'}>
            <p className={'dark:text-teal-100'}>Comments</p>
            <div className={'border border-gray-400 py-1 px-2 rounded-md'}>
              <p className={'dark:text-teal-100'}>{comments.length}</p>
            </div>
          </div>
          {comments.map(comment => (
            <Comment
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </>
      )}
    </div>
  );
};
