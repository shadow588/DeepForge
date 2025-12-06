import React, { useState } from 'react';
import { NavLink as RouterNavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Linkedin } from 'lucide-react';
import Logo from './Logo';

const navLinks = [
  { name: 'Research', path: '/' },
  { name: 'Products', path: '/solutions' },
  { name: 'Chat', path: '/chat' },
  { name: 'Demo', path: '/demo' },
];

const Layout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-primary font-sans selection:bg-black selection:text-white">
      {/* Navigation */}
      <header className="sticky top-0 z-[40] border-b border-border/40 bg-white/80 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <RouterNavLink to="/">
                <Logo />
              </RouterNavLink>
            </div>
            
            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <RouterNavLink
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive(link.path)
                      ? 'text-primary'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  {link.name}
                </RouterNavLink>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-primary hover:bg-surface focus:outline-none"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-border">
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <RouterNavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-3 rounded-md text-base font-medium ${
                    isActive(link.path)
                      ? 'bg-surface text-primary'
                      : 'text-secondary hover:text-primary hover:bg-surface'
                  }`}
                >
                  {link.name}
                </RouterNavLink>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col relative z-0">
        <Outlet />
      </main>

      {/* Footer - 在Chat页面不显示 */}
      {location.pathname !== '/chat' && (
      <footer id="contact" className="bg-white border-t border-border mt-auto relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <Logo />
              <h3 className="text-2xl font-semibold tracking-tight max-w-md">
                Forging the intelligence of tomorrow.
              </h3>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-secondary uppercase tracking-widest">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><RouterNavLink to="/" className="hover:underline">Research</RouterNavLink></li>
                <li><RouterNavLink to="/solutions" className="hover:underline">Products</RouterNavLink></li>
                <li><RouterNavLink to="/chat" className="hover:underline">Chat</RouterNavLink></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-secondary uppercase tracking-widest">Connect</h4>
              <div className="flex gap-4">
                {/* LinkedIn */}
                <a href="https://www.linkedin.com/in/ethan-z-98aa071aa/" className="text-secondary hover:text-primary transition-colors">
                  <Linkedin size={20} strokeWidth={1.5} />
                </a>
                {/* X (Twitter) */}
                <a href="https://x.com/V955101362325" className="text-secondary hover:text-primary transition-colors">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                {/* Telegram */}
                <a href="https://t.me/ethanapp" className="text-secondary hover:text-primary transition-colors">
                   <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                     <path d="M22 2L11 13" />
                     <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                   </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-border flex justify-between items-center text-xs text-secondary">
            <span>&copy; {new Date().getFullYear()} DeepForge. All rights reserved.</span>
            <span>Sydney, AU</span>
          </div>
        </div>
      </footer>
      )}
    </div>
  );
};

export default Layout;