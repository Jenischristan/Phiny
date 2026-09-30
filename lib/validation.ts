export const V = {
  name: (v: string): string => (v.trim() ? '' : 'Enter your name.'),
  user: (v: string): string =>
    !v
      ? 'Choose a username.'
      : v.length < 3 || v.length > 20
      ? 'Use 3–20 characters.'
      : /^[a-z0-9_.]+$/i.test(v)
      ? ''
      : 'Use letters, numbers, . and _ only.',
  email: (v: string): string =>
    !v
      ? 'Enter your email.'
      : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)
      ? ''
      : 'Enter a valid email address.',
  pw: (v: string): string =>
    !v
      ? 'Create a password.'
      : v.length < 8
      ? 'Use at least 8 characters.'
      : /[A-Za-z]/.test(v) && /\d/.test(v)
      ? ''
      : 'Include a letter and a number.',
  dob: (v: string): string => {
    if (!v) return 'Enter your date of birth.';
    const a = (Date.now() - new Date(v).getTime()) / 31557600000;
    return a < 0 || a > 120
      ? 'Enter a valid date.'
      : a < 13
      ? 'You must be at least 13 to join Phiny.'
      : '';
  },
};

export const strength = (v: string): number =>
  [
    v.length >= 8,
    v.length >= 12,
    /[A-Z]/.test(v) && /[a-z]/.test(v),
    /\d/.test(v),
    /[^A-Za-z0-9]/.test(v),
  ].filter(Boolean).length;
