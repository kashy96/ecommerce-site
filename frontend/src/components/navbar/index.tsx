"use client";

import Link from "next/link";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { logout } from "@/app/authSlice";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { fetchCart } from "@/app/cartSlice";

export default function Navbar({ menu }: { menu: any[] }) {
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart.cart);
  const user = useSelector((state: RootState) => state.auth.user);
  const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const { SITE_NAME } = process.env;

  const token = user.token;
  const userId = user.id;

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    dispatch(logout() as any);
  };

  useEffect(() => {
    if (userId) {
      dispatch(fetchCart() as any);
    }
  }, [dispatch, userId]);

  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
      {/* Logo */}
      <div className="flex items-center space-x-4">
        <Link href="/">
          <span className="text-xl text-black">{SITE_NAME}</span>
        </Link>
      </div>

      {/* Hamburger Icon for Mobile */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-gray-600 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Navigation Links - Desktop */}
      <div className="hidden md:flex md:space-x-6">
        {menu.slice(0, 3).map((category, index) => (
          <Link
            key={index}
            href={category.slug === "all" ? "/" : `/search/${category.slug}`}
          >
            <span className="text-gray-500 text-sm hover:underline">
              {category.name}
            </span>
          </Link>
        ))}
      </div>

      {/* Search Bar and Cart - Desktop */}
      <div className="hidden md:flex items-center space-x-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for products..."
            className="px-4 py-1 text-gray-600 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-[20vw]"
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
        </div>

        <div className="relative flex items-center space-x-4">
          {token ? (
            <>
              <Link href="/cart">
                <div className="relative">
                  <ShoppingCartIcon className="w-6 h-6 text-gray-600" />
                  <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="hover:text-gray-300 hover:cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <div className="relative opacity-50 cursor-not-allowed">
                  <ShoppingCartIcon className="w-6 h-6 text-gray-400" />
                  <span className="absolute -top-2 -right-2 bg-gray-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    0
                  </span>
                </div>
              </Link>
              <Link href="/login" className="hover:text-blue-500">
                Login
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-14 left-0 w-full bg-white border-b border-gray-200 md:hidden z-10">
          <div className="flex flex-col items-center py-4 space-y-4">

            <div className="relative w-3/4">
              <input
                type="text"
                placeholder="Search..."
                className="px-4 py-1 text-gray-600 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
            </div>

            {menu.slice(0, 3).map((category, index) => (
              <Link
                key={index}
                href={category.slug === "all" ? "/" : `/search/${category.slug}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-gray-500 text-base font-medium hover:underline">
                  {category.name}
                </span>
              </Link>
            ))}

            {token ? (
              <>
                <Link href="/cart" onClick={() => setIsMenuOpen(false)}>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <ShoppingCartIcon className="w-6 h-6 text-gray-500" />
                      <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                        {itemCount}
                      </span>
                    </div>
                    <span className="text-gray-500 text-base font-medium">
                      Cart
                    </span>
                  </div>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-500 text-base font-medium hover:text-gray-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <div className="flex items-center space-x-2">
                    <div className="relative opacity-50">
                      <ShoppingCartIcon className="w-6 h-6 text-gray-500" />
                      <span className="absolute -top-2 -right-2 bg-gray-400 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                        0
                      </span>
                    </div>
                    <span className="text-gray-500 text-base font-medium">
                      Cart
                    </span>
                  </div>
                </Link>
                <Link
                  href="/login"
                  className="text-gray-500 text-base font-medium hover:text-blue-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}