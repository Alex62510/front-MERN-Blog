import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import {
  HiOutlineUserGroup,
  HiArrowNarrowUp,
  HiAnnotation,
  HiDocumentText,
} from 'react-icons/hi';
import { Button, Table } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { CommentType, PostType, UserType } from '../types/types';

export const DashboardComp = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const { currentUser } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/user/getusers?limit=5');
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (e) {
        console.log((e as Error).message);
      }
    };
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/post/getposts?limit=5');
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setLastMonthPosts(data.lastMonthPosts);
        }
      } catch (e) {
        console.log((e as Error).message);
      }
    };
    const fetchComments = async () => {
      try {
        const res = await fetch('/api/comment/getComments?limit=5');
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          setTotalComments(data.totalComments);
          setLastMonthComments(data.lastMonthComments);
        }
      } catch (e) {
        console.log((e as Error).message);
      }
    };
    if (currentUser && currentUser.isAdmin) {
      fetchPosts();
      fetchComments();
      fetchUsers();
    }
  }, [currentUser]);

  return (
    <div className={'p-3 md:mx-auto'}>
      <div className={'flex-wrap flex gap-4 justify-center'}>
        <div
          className={
            'flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'
          }
        >
          <div className={'flex justify-between'}>
            <div className={''}>
              <h3 className={'text-gray-500 dark:text-slate-100 text-md uppercase'}>
                Total Users
              </h3>
              <p className={'text-2xl dark:text-blue-500'}>{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className="bg-teal-600  text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex  gap-2 text-sm">
            <span className="text-green-500 flex items-center font-semibold">
              <HiArrowNarrowUp />
              {lastMonthUsers}
            </span>
            <div className="dark:text-slate-100 text-gray-500">Last month</div>
          </div>
        </div>
        <div
          className={
            'flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'
          }
        >
          <div className={'flex justify-between'}>
            <div className={''}>
              <h3 className={'text-gray-500 dark:text-slate-100 text-md uppercase'}>
                Total Comments
              </h3>
              <p className={'text-2xl dark:text-blue-500'}>{totalComments}</p>
            </div>
            <HiAnnotation className="bg-indigo-500  text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex  gap-2 text-sm">
            <span className="text-green-500 flex items-center font-semibold">
              <HiArrowNarrowUp />
              {lastMonthComments}
            </span>
            <div className="dark:text-slate-100 text-gray-500">Last month</div>
          </div>
        </div>
        <div
          className={
            'flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'
          }
        >
          <div className={'flex justify-between'}>
            <div className={''}>
              <h3 className={'text-gray-500 dark:text-slate-100 text-md uppercase'}>
                Total Posts
              </h3>
              <p className={'text-2xl dark:text-blue-500'}>{totalPosts}</p>
            </div>
            <HiDocumentText className="bg-lime-600  text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex  gap-2 text-sm">
            <span className="text-green-500 flex items-center font-semibold">
              <HiArrowNarrowUp />
              {lastMonthPosts}
            </span>
            <div className="dark:text-slate-100 text-gray-500">Last month</div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between  p-3 text-sm font-semibold">
            <h1 className="text-center p-2 dark:text-slate-100">Recent users</h1>
            <Button outline gradientDuoTone="purpleToBlue">
              <Link to={'/dashboard?tab=users'}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
            </Table.Head>
            {users &&
              users.map(user => (
                <Table.Body key={user._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 transition hover:animate-pulse hover:bg-neutral-300 hover:shadow-lg">
                    <Table.Cell>
                      <img
                        src={user.profilePicture}
                        alt="user"
                        className="w-10 h-10 rounded-full bg-gray-500"
                      />
                    </Table.Cell>
                    <Table.Cell>{user.username}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between  p-3 text-sm font-semibold">
            <h1 className="text-center p-2 dark:text-slate-100">Recent comments</h1>
            <Button outline gradientDuoTone="purpleToPink">
              <Link to={'/dashboard?tab=comments'}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Likes</Table.HeadCell>
            </Table.Head>
            {comments &&
              comments.map(comment => (
                <Table.Body key={comment._id} className="divide-y ">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 transition hover:animate-pulse hover:bg-neutral-300 hover:shadow-lg ">
                    <Table.Cell className="w-96 ">
                      <p className="line-clamp-2 ">{comment.content}</p>
                    </Table.Cell>
                    <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between  p-3 text-sm font-semibold">
            <h1 className="text-center p-2 dark:text-slate-100">Recent posts</h1>
            <Button outline gradientDuoTone="greenToBlue">
              <Link to={'/dashboard?tab=posts'}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
            </Table.Head>
            {posts &&
              posts.map(post => (
                <Table.Body key={post._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 transition hover:animate-pulse hover:bg-neutral-300 hover:shadow-lg">
                    <Table.Cell>
                      <img
                        src={post.image}
                        alt="user"
                        className="w-14 h-10 rounded-md bg-gray-500"
                      />
                    </Table.Cell>
                    <Table.Cell className="w-96">{post.title}</Table.Cell>
                    <Table.Cell className="w-5">{post.category}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
      </div>
    </div>
  );
};
