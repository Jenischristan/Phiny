import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
      <p className="lbl mb-3">404 · Not Found</p>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
        PAGE NOT FOUND.
      </h1>
      <p className="text-mut max-w-sm mx-auto mb-8 text-sm">
        The pin, collection, or creator profile you are looking for does not exist or has been removed.
      </p>
      <Link href="/" className="btn btn-p">
        Back to Home
      </Link>
    </div>
  );
}
