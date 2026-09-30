'use client';

import React, { useEffect, useState } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Field } from '@/components/ui/Field';

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  text?: string;
  cta?: string;
  danger?: number | boolean;
  need?: string;
  onCancel: () => void;
  onOk: () => void;
}

export function ConfirmDialog({
  open,
  title,
  text,
  cta,
  danger,
  need,
  onCancel,
  onOk,
}: ConfirmDialogProps) {
  const [t, setT] = useState('');

  useEffect(() => {
    if (open) setT('');
  }, [open]);

  return (
    <Dialog open={open} onClose={onCancel} label={title || 'Confirm'} desc={text}>
      <h2 className="text-2xl font-bold mb-3 pr-8">{title}</h2>
      <p className="text-sm text-mut">{text}</p>
      {need && (
        <div className="mt-6">
          <Field
            id="cf"
            label={'Type ' + need + ' to continue'}
            value={t}
            onChange={setT}
            autoComplete="off"
          />
        </div>
      )}
      <div className="flex gap-3 mt-6">
        <button type="button" onClick={onCancel} className="btn btn-s flex-1">
          Cancel
        </button>
        <button
          type="button"
          disabled={!!need && t !== need}
          onClick={onOk}
          className={
            'btn flex-1 ' +
            (danger ? 'bg-coral border-coral text-black hover:opacity-85' : 'btn-p')
          }
        >
          {cta}
        </button>
      </div>
    </Dialog>
  );
}
