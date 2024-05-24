import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Button, Modal, ModalBody, ModalHeader, Table } from 'flowbite-react';
import { CommentType } from '../types/types';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { MdOutlineExpandMore } from 'react-icons/md';

export const DashComments = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        if (currentUser) {
          const res = await fetch(`/api/comment/getComments`);
          const data = await res.json();
          if (res.ok) {
            setComments(data.comments);
            if (data.comments.length < 8) {
              setShowMore(false);
            }
          }
        }
      } catch (e) {
        console.log(e);
      }
    };
    if (currentUser && currentUser.isAdmin) {
      fetchComments();
    }
  }, [currentUser?._id]);
  console.log(showMore);
  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      if (currentUser) {
        const res = await fetch(`/api/comment/getComments?startIndex=${startIndex}`);
        const data = await res.json();
        if (res.ok) {
          setComments(prev => [...prev, ...data.comments]);
          if (data.comments.length < 8) {
            setShowMore(false);
          }
        }
      }
    } catch (e) {
      console.log((e as Error).message);
    }
  };
  const handleDeleteButton = (comment: CommentType) => {
    setShowModal(true);
    setCommentIdToDelete(comment._id);
  };

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      if (currentUser) {
        const res = await fetch(`/api/user/delete/${commentIdToDelete}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
        } else {
          setComments(prev => prev.filter(comment => comment._id !== commentIdToDelete));
          setShowModal(false);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div
      className={
        'table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-teal-100 ' +
        'scrollbar-thumb-teal-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'
      }
    >
      {currentUser && currentUser.isAdmin && comments.length > 0 ? (
        <>
          <Table hoverable className={'shadow-md'}>
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Number of likes</Table.HeadCell>
              <Table.HeadCell>PostId</Table.HeadCell>
              <Table.HeadCell>UserId</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {comments.map(comment => (
              <Table.Body className={'divide-y'} key={comment._id}>
                <Table.Row
                  className={
                    'bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-neutral-200 hover:shadow-lg hover:animate-pulse'
                  }
                >
                  <Table.Cell className={'dark:text-teal-100'}>
                    {new Date(comment.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>{comment.content}</Table.Cell>
                  <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                  <Table.Cell className={'dark:text-teal-100'}>
                    {comment.postId}
                  </Table.Cell>
                  <Table.Cell className={'dark:text-teal-100'}>
                    {comment.userId}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => handleDeleteButton(comment)}
                      className={
                        'font-medium text-red-500 cursor-pointer hover:underline transition hover:text-red-900 hover:font-semibold'
                      }
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <div className={'py-2'}>
              <Button
                gradientDuoTone={'greenToBlue'}
                onClick={handleShowMore}
                className={
                  ' w-full self-center text-sm text-teal-950 bg-white hover:text-white hover:bg-white'
                }
                outline
              >
                <MdOutlineExpandMore className={'w-5 h-5'} />
              </Button>
            </div>
          )}
        </>
      ) : (
        <p>You have no comments yet!</p>
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
            <div className={'flex justify-center gap-10 '}>
              <Button gradientDuoTone={'pinkToOrange'} onClick={handleDeleteComment}>
                Yes I'm sure
              </Button>
              <Button
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
  );
};
