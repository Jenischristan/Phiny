import React from 'react';

interface EmptyProps {
  title: string;
  text: string;
  cta?: string;
  go?: () => void;
}

export function Empty({ title, text, cta, go }: EmptyProps) {
  return (
    <div className="border border-line px-6 py-16 text-center">
      <p className="lbl">{title}</p>
      <p className="mt-3 text-mut max-w-sm mx-auto">{text}</p>
      {cta && (
        <button type="button" onClick={go} className="btn btn-s mt-6">
          {cta}
        </button>
      )}
    </div>
  );
}
