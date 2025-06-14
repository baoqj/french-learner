"use client";

import { useState, useRef, useEffect } from "react"; // 导入 useState, useRef, useEffect
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/contexts/app-context";

export default function Header() {
  const { user, logout } = useApp();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // 控制下拉菜单的显示/隐藏
  const dropdownRef = useRef<HTMLDivElement>(null); // 用于检测点击外部区域

  // 点击头像切换下拉菜单显示状态
  const handleAvatarClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // 点击下拉菜单选项的处理函数
  const handleMenuItemClick = () => {
    setIsDropdownOpen(false); // 点击选项后关闭下拉菜单
    // 这里可以添加跳转到对应页面的逻辑
  };

  // 处理注销
  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false); // 注销后关闭下拉菜单
  };

  // 点击外部区域关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    // 只有在下拉菜单打开时才监听点击事件
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // 清理事件监听器
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]); // 当 isDropdownOpen 变化时重新注册/清理监听器

  return (
    <header className='flex items-center justify-between p-4 bg-gray-100'>
      {/* 网站 Logo - 左侧对齐 */}
      <div className='flex items-center'>
        <Link href='/'>
          {/* 使用 Next.js Image 组件优化图片加载 */}
          {/* <Image
            src="/placeholder-logo.png"
            alt="Website Logo"
            width={32} // 根据你的 Logo 大小设置
            height={32} // 根据你的 Logo 大小设置
            className="mr-2"
          /> */}
          {/* 或者使用文字 */}
          <span className='text-3xl font-bold text-blue-700'>VoLaLa</span>
        </Link>
      </div>

      {/* 右侧内容：登录/注册按钮 或 用户头像和注销按钮 */}
      <nav className='flex items-center space-x-4 relative'>
        {" "}
        {/* 添加 relative */}
        {user ? (
          // 用户已登录，显示用户头像和下拉菜单
          <div ref={dropdownRef} className='relative'>
            {" "}
            {/* 添加 ref 和 relative */}
            {/* 用户头像 */}
            <button
              onClick={handleAvatarClick}
              className='focus:outline-none rounded-full'
            >
              {" "}
              {/* 使按钮呈圆形 */}
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt='User Avatar'
                  width={32}
                  height={32}
                  className='rounded-full'
                />
              ) : (
                <div className='w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full'>
                  {user.email ? user.email[0].toUpperCase() : "U"}
                </div>
              )}
            </button>
            {/* 下拉菜单 */}
            {isDropdownOpen && (
              <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10'>
                {/* Profile 选项 */}
                <button
                  onClick={handleMenuItemClick}
                  className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left'
                >
                  {/* Profile Icon (示例 SVG) */}
                  <svg
                    className='mr-2 h-4 w-4 text-gray-500'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                    />
                  </svg>
                  Profile
                </button>

                {/* Membership 选项 */}
                <button
                  onClick={handleMenuItemClick}
                  className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left'
                >
                  {/* Membership Icon (示例 SVG) */}
                  <svg
                    className='mr-2 h-4 w-4 text-gray-500'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h.01M17 9v2a2 2 0 01-2 2H7m4 4l3-3m0 0l3 3m-3-3v4m-4-4h.01M20 12v.01M20 16v.01'
                    />
                  </svg>
                  Membership
                </button>

                {/* Settings 选项 */}
                <button
                  onClick={handleMenuItemClick}
                  className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left'
                >
                  {/* Settings Icon (示例 SVG) */}
                  <svg
                    className='mr-2 h-4 w-4 text-gray-500'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
                    />
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                    />
                  </svg>
                  Settings
                </button>

                <div className='border-t border-gray-100 my-1'></div>

                {/* Logout 选项 */}
                <button
                  onClick={handleLogout}
                  className='flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-100 w-full text-left'
                >
                  {/* Logout Icon (示例 SVG) */}
                  <svg
                    className='mr-2 h-4 w-4 text-red-500'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                    />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          // 用户未登录，显示登录和注册按钮
          <>
            <Link href='/login'>
              <button className='px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600'>
                Login
              </button>
            </Link>
            <Link href='/register'>
              <button className='px-4 py-2 text-blue-500 border border-blue-500 rounded hover:bg-blue-500 hover:text-white'>
                Register
              </button>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
