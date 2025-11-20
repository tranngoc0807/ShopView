'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { useCart } from '@/src/contexts/CartContext';
import CartDrawer from './CartDrawer';
import SearchInput from './SearchInput';

interface HeaderProps {
  onSearchChange?: (query: string) => void;
}

export default function Header({ onSearchChange }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const { totalItems } = useCart();

  useEffect(() => {
    // Get initial user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    
    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsUserMenuOpen(false);
    router.push('/');
    router.refresh();
  };

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-gray-900">
            FASHION STORE
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/women" 
              className={`font-medium transition ${
                pathname === '/women' 
                  ? 'text-gray-900 border-b-2 border-gray-900 pb-1' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Nữ
            </Link>
            <Link 
              href="/men" 
              className={`font-medium transition ${
                pathname === '/men' 
                  ? 'text-gray-900 border-b-2 border-gray-900 pb-1' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Nam
            </Link>
            <Link 
              href="/kids" 
              className={`font-medium transition ${
                pathname === '/kids' 
                  ? 'text-gray-900 border-b-2 border-gray-900 pb-1' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Trẻ em
            </Link>
            <Link 
              href="/new" 
              className={`font-medium transition ${
                pathname === '/new' 
                  ? 'text-red-700 border-b-2 border-red-600 pb-1' 
                  : 'text-red-600 hover:text-red-700'
              }`}
            >
              Mới về
            </Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            {/* Search Input */}
            <SearchInput onSearchChange={onSearchChange || (() => {})} />
            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
                >
                  <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-medium">
                    {user.email?.[0].toUpperCase()}
                  </div>
                  <span className="hidden md:block font-medium">
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm text-gray-500">Đăng nhập với</p>
                      <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/account"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Tài khoản của tôi
                    </Link>
                    <Link
                      href="/account/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Đơn hàng
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="hidden md:flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm">Đăng nhập</span>
              </Link>
            )}

            <button 
              onClick={() => setIsCartOpen(true)}
              className="text-gray-700 hover:text-gray-900 relative"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {totalItems}
                </span>
              )}
            </button>
            <button 
              className="md:hidden text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            <Link 
              href="/women" 
              className={`block py-2 font-medium transition ${
                pathname === '/women' 
                  ? 'text-gray-900 font-bold' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Nữ
            </Link>
            <Link 
              href="/men" 
              className={`block py-2 font-medium transition ${
                pathname === '/men' 
                  ? 'text-gray-900 font-bold' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Nam
            </Link>
            <Link 
              href="/kids" 
              className={`block py-2 font-medium transition ${
                pathname === '/kids' 
                  ? 'text-gray-900 font-bold' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Trẻ em
            </Link>
            <Link 
              href="/new" 
              className={`block py-2 font-medium transition ${
                pathname === '/new' 
                  ? 'text-red-700 font-bold' 
                  : 'text-red-600 hover:text-red-700'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Mới về
            </Link>
            <Link 
              href="/sale" 
              className={`block py-2 font-medium transition ${
                pathname === '/sale' 
                  ? 'text-gray-900 font-bold' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Sale
            </Link>
          </nav>
        )}
      </div>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}
