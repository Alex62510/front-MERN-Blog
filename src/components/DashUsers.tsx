import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Button, Modal, ModalBody, ModalHeader, Table } from 'flowbite-react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { UserType } from '../types/types';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { MdOutlineExpandMore } from 'react-icons/md';

export const DashUsers = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [users, setUsers] = useState<UserType[]>([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (currentUser) {
          const res = await fetch(`/api/user/getusers`);
          const data = await res.json();
          if (res.ok) {
            setUsers(data.users);
            if (data.users.length < 8) {
              setShowMore(false);
            }
          }
        }
      } catch (e) {
        console.log(e);
      }
    };
    if (currentUser && currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser?._id]);
  console.log(showMore);
  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      if (currentUser) {
        const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
        const data = await res.json();
        if (res.ok) {
          setUsers(prev => [...prev, ...data.users]);
          if (data.users.length < 8) {
            setShowMore(false);
          }
        }
      }
    } catch (e) {
      console.log((e as Error).message);
    }
  };
  const handleDeleteButton = (user: UserType) => {
    setShowModal(true);
    setUserIdToDelete(user._id);
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      if (currentUser) {
        const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
        } else {
          setUsers(prev => prev.filter(user => user._id !== userIdToDelete));
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
      {currentUser && currentUser.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className={'shadow-md'}>
            <Table.Head>
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {users.map(user => (
              <Table.Body className={'divide-y'} key={user._id}>
                <Table.Row
                  className={
                    'bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-neutral-200 hover:shadow-lg hover:animate-pulse'
                  }
                >
                  <Table.Cell className={'dark:text-teal-100'}>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className={'w-10 h-10 rounded-full object-cover bg-gray-500 '}
                    />
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell className={'dark:text-teal-100'}>{user.email}</Table.Cell>
                  <Table.Cell className={'dark:text-teal-100'}>
                    {user.isAdmin ? (
                      <FaCheck className={'text-green-700'} />
                    ) : (
                      <FaTimes className={'text-red-700'} />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => handleDeleteButton(user)}
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
        <p>You have no users yet!</p>
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
              Are you sure you want to delete this user?
            </h3>
            <div className={'flex justify-center gap-10 '}>
              <Button gradientDuoTone={'pinkToOrange'} onClick={handleDeleteUser}>
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
