'use client';

import React, { useState } from 'react';
import { Icon } from '@/components/ui/Icon';

interface ImageUploaderProps {
  value: string;
  onChange: (v: string) => void;
  label?: string;
  hint?: string;
  altText?: string;
}

export function ImageUploader({
  value,
  onChange,
  label = 'Add image',
  hint = 'Drag and drop, or browse',
  altText = 'Image preview',
}: ImageUploaderProps) {
  const [drag, setDrag] = useState(false);
  const [pg, setPg] = useState<number | null>(null);
  const [err, setErr] = useState('');

  const load = (f?: File) => {
    setErr('');
    if (!f) return;
    if (!f.type.startsWith('image/') || f.size > 5e6) {
      setErr('Choose an image under 5 MB.');
      return;
    }
    const r = new FileReader();
    r.onprogress = (e) =>
      e.lengthComputable && setPg(Math.round((e.loaded / e.total) * 100));
    r.onloadstart = () => setPg(5);
    r.onload = () =>
      setTimeout(() => {
        onChange(typeof r.result === 'string' ? r.result : '');
        setPg(null);
      }, 400);
    r.readAsDataURL(f);
  };

  if (value) {
    return (
      <div className="flex items-center gap-4">
        <img
          src={value}
          alt={altText}
          className="w-28 h-28 object-cover border border-line"
        />
        <div className="flex flex-col gap-2">
          <label className="btn btn-s sm cursor-pointer focus-within:outline focus-within:outline-2 focus-within:outline-navy">
            Replace
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => load(e.target.files?.[0])}
            />
          </label>
          <button type="button" onClick={() => onChange('')} className="btn btn-s sm">
            Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          load(e.dataTransfer.files?.[0]);
        }}
        className={
          'block border border-dashed p-12 text-center cursor-pointer transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-navy ' +
          (drag ? 'border-fg bg-sub' : 'border-mut hover:bg-sub')
        }
      >
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => load(e.target.files?.[0])}
        />
        {pg !== null ? (
          <div
            role="progressbar"
            aria-valuenow={pg}
            aria-label="Uploading"
            className="h-1 bg-line max-w-xs mx-auto"
          >
            <div className="h-1 bg-fg transition-all" style={{ width: pg + '%' }}></div>
          </div>
        ) : (
          <div className="grid place-items-center gap-3">
            <Icon n="plus" c="w-8 h-8" />
            <span className="lbl text-fg">{label}</span>
            <span className="text-sm text-mut">{hint}</span>
          </div>
        )}
      </label>
      {err && (
        <p role="alert" className="text-xs mt-2">
          <span className="inline-block w-2 h-2 bg-coral mr-2"></span>
          {err}
        </p>
      )}
    </div>
  );
}
