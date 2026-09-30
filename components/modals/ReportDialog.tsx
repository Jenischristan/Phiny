'use client';

import React, { useEffect, useState } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { useC } from '@/context/PhinyContext';
import { RR } from '@/data/mockData';

export function ReportDialog() {
  const c = useC();
  const o = c.rp;
  const [s, setS] = useState(0);
  const [r, setR] = useState('');
  const k = o ? o.kind : 'post';
  const x = () => c.setRp(null);

  useEffect(() => {
    if (o) {
      setS(0);
      setR('');
    }
  }, [o]);

  return (
    <Dialog
      open={!!o}
      onClose={x}
      label={'Report ' + k}
      desc="Choose a reason, then confirm your report."
    >
      {s === 0 ? (
        <div>
          <h2 className="text-2xl font-bold mb-1 pr-8">Report {k}</h2>
          <p className="text-sm text-mut mb-4">Why are you reporting this?</p>
          <fieldset>
            <legend className="sr-only">Reason</legend>
            <div className="border border-line divide-y divide-line">
              {RR.map((v) => (
                <label
                  key={v}
                  className="flex items-center gap-3 p-3 text-sm cursor-pointer hover:bg-sub"
                >
                  <input
                    type="radio"
                    name="rr"
                    checked={r === v}
                    onChange={() => setR(v)}
                    className="w-4 h-4 accent-fg"
                  />
                  {v}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="flex gap-3 mt-6">
            <button type="button" onClick={x} className="btn btn-s flex-1">
              Cancel
            </button>
            <button
              type="button"
              disabled={!r}
              onClick={() => setS(1)}
              className="btn btn-p flex-1"
            >
              Continue
            </button>
          </div>
        </div>
      ) : s === 1 ? (
        <div>
          <h2 className="text-2xl font-bold mb-3 pr-8">Submit report?</h2>
          <p className="text-sm text-mut">
            Your report will be reviewed according to Phiny’s policies.
          </p>
          <p className="lbl mt-4">Reason · {r}</p>
          <div className="flex gap-3 mt-6">
            <button type="button" onClick={() => setS(0)} className="btn btn-s flex-1">
              Back
            </button>
            <button
              type="button"
              autoFocus
              onClick={() => setS(2)}
              className="btn btn-p flex-1"
            >
              Submit report
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-3 pr-8">Report submitted</h2>
          <p className="text-sm text-mut">
            Thank you. We’ll review this {k} and take action if it breaks our policies.
          </p>
          <button
            type="button"
            autoFocus
            onClick={x}
            className="btn btn-p w-full mt-6"
          >
            Done
          </button>
        </div>
      )}
    </Dialog>
  );
}
