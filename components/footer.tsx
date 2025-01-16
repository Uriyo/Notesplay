import { Github } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

export default function Footer(){
  return (
    <div className="-mt-5 mb-3 flex  justify-center text-gray-500">
      <div className='flex'>
        <span className='mr-1'>Made with ❤️ by</span>  <Link className='underline text-blue-500 flex flex-row mr-2' href={`https://github.com/Uriyo`}> Uriyo </Link><Github />
      </div>
    </div>
  );
}

