import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Button, Select, TextInput } from 'flowbite-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PostCard } from '../components/PostCard';
import { PostType } from '../types/types';
import { Spiner } from '../components/Spiner';
import { MdOutlineExpandMore } from 'react-icons/md';

export const Search = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: '',
  });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const sortFromUrl = urlParams.get('sort');
    const categoryFromUrl = urlParams.get('category');
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl || '',
        sort: sortFromUrl || 'desc',
        category: categoryFromUrl || '',
      });
    }

    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/post/getposts?${searchQuery}`);
      const data = await res.json();
      if (!res.ok) {
        setLoading(false);
        return;
      }
      if (res.ok) {
        setPosts(data.posts);
        setLoading(false);
        if (data.posts.length === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    };
    fetchPosts();
  }, [location.search]);

  const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    if (e.target.id === 'searchTerm') {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (e.target.id === 'sort') {
      const order = e.target.value || 'desc';
      setSidebarData({ ...sidebarData, sort: order });
    }
    if (e.target.id === 'category') {
      const category = e.target.value || '';
      if (category !== 'uncategorized') {
        setSidebarData({ ...sidebarData, category });
      } else {
        setSidebarData({ ...sidebarData, category: '' });
      }
    }
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebarData.searchTerm);
    urlParams.set('sort', sidebarData.sort);
    urlParams.set('category', sidebarData.category);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  const handleShowMore = async () => {
    const startIndex = posts.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex.toString());
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/post/getposts?${searchQuery}`);
    if (!res.ok) {
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setPosts([...posts, ...data.posts]);
      if (data.posts.length === 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex   items-center gap-2">
            <label className="whitespace-nowrap font-semibold dark:text-teal-100">
              Search Term:
            </label>
            <TextInput
              placeholder="Search..."
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold dark:text-teal-100">Sort:</label>
            <Select onChange={handleChange} value={sidebarData.sort} id="sort">
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold dark:text-teal-100">Category:</label>
            <Select onChange={handleChange} value={sidebarData.category} id="category">
              <option value="uncategorized">Uncategorized</option>
              <option value="reactjs">React.js</option>
              <option value="nodejs">Node.js</option>
              <option value="typescript">TypeScript</option>
            </Select>
          </div>
          <Button type="submit" outline gradientDuoTone="purpleToPink" disabled={loading}>
            {loading ? 'loading...' : 'Apply Filters'}
          </Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5 dark:text-teal-100">
          Posts results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && posts.length === 0 && (
            <p className="text-xl text-gray-500">No posts found.</p>
          )}
          {loading && (
            <div className={'flex justify-center items-center mx-auto pt-10'}>
              <Spiner />
            </div>
          )}
          {!loading &&
            posts &&
            posts.map(post => <PostCard key={post._id} post={post} />)}
          {showMore && (
            <Button
              gradientDuoTone={'purpleToPink'}
              onClick={handleShowMore}
              className={
                ' w-full self-center text-sm text-teal-950 bg-white hover:text-white hover:bg-white'
              }
              outline
            >
              <MdOutlineExpandMore className={'w-5 h-5'} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
