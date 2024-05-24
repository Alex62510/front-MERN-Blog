import React from 'react';
import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { BsFacebook, BsTelegram, BsLinkedin, BsGithub, BsDribbble } from 'react-icons/bs';

export const FooterComp = () => {
  return (
    <Footer container className="border-2  border-teal-500 ">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <div className="mt-5">
            <Link
              to={'/'}
              className={
                'hover:animate-pulse self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white hover:scale-105 transition hover:opacity-80'
              }
            >
              <span
                className={
                  'px-3 py-1 bg-gradient-to-r from-cyan-500 via-emerald-500 to-lime-500 rounded-lg text-white '
                }
              >
                OrlovAlex's
              </span>
              Blog
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6 pl-5">
            <div>
              <Footer.Title title="About" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://alex62510.github.io/MyPortfolio/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  My portfolio
                </Footer.Link>
                <Footer.Link href="/about" target="_blank" rel="noopener noreferrer">
                  Alex's Blog
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Follow" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://github.com/Alex62510"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Github
                </Footer.Link>
                <Footer.Link href="#">Discord</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Legal" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Privacy Policy</Footer.Link>
                <Footer.Link href="#">Terms &amp; Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright href="#" by="Alex's blog" year={new Date().getFullYear()} />
          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
            <Footer.Icon href="#" icon={BsFacebook} className={'hover:opacity-80'} />
            <Footer.Icon
              target="_blank"
              rel="noopener noreferrer"
              href="https://t.me/AliakseiOrlov"
              icon={BsTelegram}
              className={'hover:opacity-80'}
            />
            <Footer.Icon
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.linkedin.com/in/alex-orlov-8a2078287/"
              icon={BsLinkedin}
              className={'hover:opacity-80'}
            />
            <Footer.Icon
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/Alex62510"
              icon={BsGithub}
              className={'hover:opacity-80'}
            />
            <Footer.Icon href="#" icon={BsDribbble} className={'hover:opacity-80'} />
          </div>
        </div>
      </div>
    </Footer>
  );
};
