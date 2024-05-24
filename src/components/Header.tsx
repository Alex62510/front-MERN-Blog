import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Button, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { AppDispatch, RootState } from '../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { Profile } from './Profile';
import { toggleTheme } from '../redux/theme/themeSlice';

export const Header = () => {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { theme } = useSelector((state: RootState) => state.theme);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    } else {
      setSearchTerm('');
    }
  }, [location.search]);

  return (
    <Navbar className={'border-b-2'}>
      <Link
        to={'/'}
        className={
          'hover:animate-pulse self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white hover:opacity-80 transition'
        }
      >
        <span
          className={
            ' px-3 py-1 bg-gradient-to-r from-cyan-500 via-emerald-500 to-lime-500 rounded-lg text-white '
          }
        >
          OrlovAlex's
        </span>
        Blog
      </Link>
      <form className={'flex'} onSubmit={handleSubmit}>
        <TextInput
          type={'text'}
          placeholder={'Search...'}
          rightIcon={AiOutlineSearch}
          className={'hidden lg:inline'}
          value={searchTerm}
          onChange={handleSearch}
        />
        <Button type={'submit'} className={'w-12 h-10  lg:hidden'} color="green" pill>
          <AiOutlineSearch />
        </Button>
      </form>
      <div className={'flex gap-2 md:order-2 '}>
        <Button
          className={'w-12 h-10 sm:inline'}
          color="green"
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === 'light' ? <FaSun /> : <FaMoon />}
        </Button>

        {currentUser ? (
          <Profile />
        ) : (
          <Link to={'/sign-in'}>
            <Button gradientDuoTone={'greenToBlue'} outline className={'transition'}>
              Sign in
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link
          active={path === '/'}
          as={'div'}
          className={'hover:scale-105 transition hover:animate-pulse'}
        >
          <Link to={'/'}>Home</Link>
        </Navbar.Link>
        <Navbar.Link
          active={path === '/about'}
          as={'div'}
          className={'hover:scale-105 transition hover:animate-pulse'}
        >
          <Link to={'/about'}>About</Link>
        </Navbar.Link>
        <Navbar.Link
          active={path === '/projects'}
          as={'div'}
          className={'hover:scale-105 transition hover:animate-pulse'}
        >
          <Link to={'/projects'}>Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};
