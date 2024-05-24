import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Spiner } from '../components/Spiner';
import { PostType } from '../types/types';
import { Button } from 'flowbite-react';
import { CallToAction } from '../components/CallToAction';
import { CommentSection } from '../components/CommentSection';
import { PostCard } from '../components/PostCard';

export const PostPage = () => {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [post, setPost] = useState<PostType | null>(null);
  const [recentPosts, setResentPosts] = useState<PostType[] | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.message);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setPost(data.posts[0]);
          setLoading(false);
          setError('');
        }
      } catch (e) {
        setError((e as Error).message);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?limit=3`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.message);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setResentPosts(data.posts);
          setLoading(false);
          setError('');
        }
      } catch (e) {
        setError((e as Error).message);
      }
    };
    fetchRecentPosts();
  }, []);

  if (loading)
    return (
      <div className={'flex justify-center items-center text-center min-h-screen'}>
        <Spiner />
      </div>
    );
  return (
    <main className={'p-3 flex flex-col max-w-6xl mx-auto min-h-screen'}>
      <h1
        className={
          'text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl dark:text-teal-100'
        }
      >
        {post && post.title}
      </h1>
      <Link to={`/search?category=${post?.category}`} className={'self-center mt-5'}>
        <Button gradientDuoTone={'greenToBlue'} outline size={'xs'}>
          <span>{post && post.category} </span>
        </Button>
      </Link>
      <img
        src={post?.image}
        alt={post?.title}
        className={'mt-10 p-3 max-h-[600px] w-full object-cover'}
      />
      <div
        className={
          'flex justify-between dark:text-teal-100 p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'
        }
      >
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span>{post && (post.content.length / 1000).toFixed(0)} mins read</span>
      </div>
      {post && (
        <div
          className={'p-3 max-w-2xl mx-auto w-full post-content dark:text-teal-100'}
          dangerouslySetInnerHTML={{ __html: post.content }}
        ></div>
      )}
      <div className={'max-w-4xl mx-auto w-full dark:text-teal-100'}>
        <CallToAction />
      </div>
      {post && <CommentSection postId={post._id} />}
      {error && error}
      <div className={'flex flex-col justify-center items-center mb-5'}>
        <h1 className={'text-xl mt-5 dark:text-teal-100'}>Recent articles</h1>
        <div className={'flex flex-wrap gap-5 mt-5 justify-center'}>
          {recentPosts &&
            recentPosts.map(post => <PostCard key={post._id} post={post} />)}
        </div>
      </div>
    </main>
  );
};
