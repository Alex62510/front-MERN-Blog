import { CallToAction } from '../components/CallToAction';
import { DashSidebar } from '../components/DashSidebar';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

export const Projects = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  return (
    <div className={'min-h-screen flex flex-col md:flex-row gap-5  mx-auto'}>
      <div className={'md:w-56'}>{currentUser && <DashSidebar />}</div>
      <div className="min-h-screen max-w-2xl mx-auto flex justify-center items-center flex-col gap-6 p-3">
        <h1 className="text-3xl font-semibold dark:text-teal-100">Pojects</h1>
        <p className="text-md text-gray-500">
          Build fun and engaging projects while learning HTML, CSS, and JavaScript!
        </p>
        <CallToAction />
      </div>
    </div>
  );
};
