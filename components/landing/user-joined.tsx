"use client";

import { useEffect, useState } from 'react';
import { getWaitlistCount } from '@/app/actions';

export default function UserJoined() {
  const [count, setCount] = useState<number | string>('-');

  useEffect(() => {
    async function fetchWaitlistCount() {
      const waitlistCount = await getWaitlistCount();
      setCount(waitlistCount);
    }

    fetchWaitlistCount();
  }, []);

  return (
    <p className="text-xs text-white/80 mt-2">
      <span className='text-xs font-bold text-[#37ecba]'>{count}</span> {count === 1 ? 'user has' : 'users have'} joined the waitlist
    </p>
  );
}
