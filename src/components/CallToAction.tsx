import { Button } from 'flowbite-react';

export const CallToAction = () => {
  return (
    <div
      className={
        'flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center sm:rounded-tl-2xl'
      }
    >
      <div className={'flex-1 flex flex-col justify-center'}>
        <h2 className={'text-2xl dark:text-teal-100'}>
          Want learn more about TypeScript?
        </h2>
        <p className={'text-gray-500 my-2'}>Checkout these resources on my page</p>
        <Button
          gradientDuoTone={'purpleToBlue'}
          className={'rounded-tl-xl rounded-bl-none'}
        >
          <a
            href="https://github.com/Alex62510"
            target={'_blank'}
            rel={'noopener noreferrer'}
          >
            Go to GitHub page
          </a>
        </Button>
      </div>
      <div className={'p-7 flex-1'}>
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3514yIO_nGw6yag1QJ3nAoRxmkdaA_cV4KA&usqp=CAU"
          alt={'typeScript & vite'}
        />
      </div>
    </div>
  );
};
