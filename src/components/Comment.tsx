import React, { useEffect, useState } from 'react';
import { CommentType, UserType } from '../types/types';
import moment from 'moment';
import { FaThumbsUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Alert, Button, Modal, ModalBody, ModalHeader, Textarea } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

type Props = {
  comment: CommentType;
  onLike: (commentId: string) => void;
  onEdit: (commentId: string, editContent: string) => void;
  onDelete: (commentId: string) => void;
};
export const Comment = ({ comment, onLike, onEdit, onDelete }: Props) => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [user, setUser] = useState<UserType | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [commentError, setCommentError] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        }
      } catch (e) {
        console.log(e);
      }
    };
    getUser();
  }, [comment]);

  const handleEdit = () => {
    setIsEdit(true);
    setEditedContent(comment.content);
  };
  const handleSave = async () => {
    try {
      const res = await fetch(`/api/comment/editComments/${comment._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: editedContent,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsEdit(false);
        onEdit(comment._id, editedContent);
        setCommentError('');
      } else {
        setCommentError(data.message);
      }
    } catch (e) {
      console.log((e as Error).message);
    }
  };

  const handleDelete = (commentId: string) => {
    onDelete(commentId);
    setShowModal(false);
  };

  return (
    <div className={'flex p-4 border-b dark:border-gray-600 text-sm'}>
      {user && (
        <div className={'flex-shrink-0 mr-3'}>
          <img
            className={'w-10 h-10 rounded-full bg-gray-500 '}
            src={user.profilePicture}
            alt={user.username}
          />
        </div>
      )}
      <div className={'flex-1'}>
        <div className={'flex items-center mb-1'}>
          <span className={'font-bold mr-1 text-xs truncate dark:text-teal-100'}>
            {user ? `@${user.username}` : 'anonymous user'}
          </span>
          <span className={'text-gray-500 text-xs'}>
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {isEdit ? (
          <>
            {' '}
            <Textarea
              className={'mb-2 dark:text-teal-100'}
              value={editedContent}
              onChange={e => setEditedContent(e.target.value)}
              rows={3}
            ></Textarea>
            <div className={'flex justify-end gap-2 text-xs'}>
              <Button
                size={'sm'}
                type={'button'}
                className={'hover:animate-pulse transition'}
                gradientDuoTone={'purpleToBlue'}
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                size={'sm'}
                type={'button'}
                className={'hover:animate-pulse transition'}
                gradientDuoTone={'greenToBlue'}
                outline
                onClick={() => setIsEdit(false)}
              >
                Cancel
              </Button>
            </div>
            {commentError && (
              <Alert color={'failure'} className={'mt-5'}>
                {commentError && commentError}
              </Alert>
            )}
          </>
        ) : (
          <>
            <p className={'text-gray-500 mb-2'}>{comment.content}</p>
            <div
              className={
                'flex gap-3 items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit'
              }
            >
              <button
                type={'button'}
                onClick={() => onLike(comment._id)}
                className={` hover:text-cyan-600 text-blue-300 ${currentUser && comment.likes.includes(currentUser._id) && '!text-emerald-500'}`}
              >
                <FaThumbsUp className={'text-sm'} />
              </button>
              <p className={'text-gray-400'}>
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    ' ' +
                    (comment.numberOfLikes === 1 ? 'like' : 'likes')}
              </p>
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <>
                    <button
                      onClick={handleEdit}
                      type={'button'}
                      className={'text-gray-500 hover:text-cyan-600 hover:underline'}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setShowModal(true)}
                      type={'button'}
                      className={'text-gray-500 hover:text-red-500 hover:underline'}
                    >
                      Delete
                    </button>
                  </>
                )}
              <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                popup
                size={'md'}
                position={'center'}
              >
                <ModalHeader color={'caretColor'} />
                <ModalBody>
                  <div className={'text-center'}>
                    <HiOutlineExclamationCircle
                      className={
                        'h-16 w-16 text-lime-500 dark:text-gray-200  mt-4 mx-auto transition animate-bounce'
                      }
                    />
                    <h3 className={'mb-6 text-lg text-gray-600'}>
                      Are you sure you want to delete this comment?
                    </h3>
                    <div className={'flex justify-center gap-10  '}>
                      <Button
                        className={'hover:animate-pulse transition'}
                        gradientDuoTone={'pinkToOrange'}
                        onClick={() => handleDelete(comment._id)}
                      >
                        Yes I'm sure
                      </Button>
                      <Button
                        className={'hover:animate-pulse transition'}
                        outline
                        gradientDuoTone={'tealToLime'}
                        onClick={() => setShowModal(false)}
                      >
                        No, cancel
                      </Button>
                    </div>
                  </div>
                </ModalBody>
              </Modal>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
