"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // 导入 useRouter
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // 获取 router 实例

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (error: any) {
      setError(error.message);
      console.error("Login error:", error);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (error: any) {
      setError(error.message);
      console.error("Google login error:", error);
    }
  };

  // 处理 Cancel 按钮点击事件
  const handleCancel = () => {
    router.back(); // 返回上一页
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg w-80'>
        <h3 className='text-2xl font-bold text-center mb-6'>
          Login to your account
        </h3>
        <form onSubmit={handleLogin}>
          <div className='mt-4'>
            <div>
              <label className='block' htmlFor='email'>
                Email
              </label>
              <input
                type='email'
                placeholder='Email'
                className='w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className='mt-4'>
              <label className='block' htmlFor='password'>
                Password
              </label>
              <input
                type='password'
                placeholder='Password'
                className='w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}

            {/* 包含按钮的 div */}
            <div className='flex justify-between items-center mt-6'>
              {" "}
              {/* 修改为 flex 布局，子元素左右对齐 */}
              {/* Cancel 按钮 */}
              <button
                type='button' // 设置 type="button" 避免触发表单提交
                onClick={handleCancel}
                className='px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100'
              >
                Cancel
              </button>
              {/* Login 按钮 */}
              <button
                type='submit'
                className='px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-900'
              >
                Login
              </button>
            </div>

            {/* Don't have an account? Register 提示文字 - 单独一行并居中 */}
            <div className='mt-4 text-center'>
              <Link href='/register'>
                <span className='text-sm text-blue-600 hover:underline cursor-pointer'>
                  Don't have an account? Register
                </span>
              </Link>
            </div>
          </div>
        </form>

        {/* 分隔线 */}
        <div className='mt-6 flex items-center justify-center'>
          <span className='text-gray-500'>Or</span>
        </div>

        {/* Google 登录按钮 */}
        <div className='mt-4'>
          <button
            onClick={handleGoogleLogin}
            className='w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          >
            {/* 可以添加 Google 图标 */}
            <svg
              className='w-5 h-5 mr-2'
              aria-hidden='true'
              viewBox='0 0 24 24'
              fill='currentColor'
            >
              <path d='M22.545 10.333v2.42h-2.474v-2.42H17.65v-2.42h2.413v-2.413h2.413v2.413h2.413v2.42zM12.25 20.813c2.98 0 5.45-1.013 7.263-3.04l-2.075-1.998c-1.125 1.025-2.638 1.625-4.188 1.625-3.425 0-6.288-2.775-6.288-6.25s2.863-6.25 6.288-6.25c1.55 0 3.063.6 4.188 1.625l2.075-1.998c-1.813-2.027-4.283-3.04-7.263-3.04-5.45 0-9.875 4.425-9.875 9.875s4.425 9.875 9.875 9.875z'></path>
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}
