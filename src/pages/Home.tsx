import { Link } from 'react-router-dom';
import { PostCard } from '../components/PostCard';
import { CallToAction } from '../components/CallToAction';
import { useEffect, useState } from 'react';
import { PostType } from '../types/types';
import { DashSidebar } from '../components/DashSidebar';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

export default function Home() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const { currentUser } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/post/getPosts');
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
        }
      } catch (e) {
        console.log((e as Error).message);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className={'min-h-screen flex flex-col md:flex-row gap-5  mx-auto'}>
      <div className={'md:w-56'}>{currentUser && <DashSidebar />}</div>
      <div className={'flex-1'}>
        <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto text-center">
          <h1 className="text-3xl font-bold lg:text-6xl dark:text-teal-100 text-center ">
            Welcome to my Blog
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm">
            Here you'll find all posts created by users!
          </p>
          <Link
            to="/search"
            className="text-xs sm:text-sm text-teal-500 font-bold hover:underline"
          >
            View all posts
          </Link>
        </div>
        <div className=" m-3 lg:mr-7 md:mr-7 bg-amber-100 dark:bg-slate-700  rounded-tl-3xl rounded-br-3xl">
          <CallToAction />
        </div>

        <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-5">
          {posts && posts.length > 0 && (
            <div className="flex flex-col gap-6 mx-auto">
              <h2 className="text-2xl font-semibold text-center dark:text-teal-100">
                Recent Posts
              </h2>
              <div className="flex flex-wrap gap-4 justify-center">
                {posts.map(post => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
              <Link
                to={'/search'}
                className="text-lg text-teal-500 hover:underline text-center"
              >
                View all posts
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
