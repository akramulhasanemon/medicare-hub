import React from 'react';
import dynamic from 'next/dynamic';

const App = dynamic(() => import('../src/App'), { 
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-slate-300">Loading MediCare Hub Next.js...</p>
      </div>
    </div>
  )
});

export default function Home() {
  return <App />;
}
