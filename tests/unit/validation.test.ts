import { describe, it, expect } from 'vitest';
import { V, strength } from '@/lib/validation';

describe('Validation Utilities (V)', () => {
  describe('name validation', () => {
    it('requires non-empty name', () => {
      expect(V.name('')).toBe('Enter your name.');
      expect(V.name('   ')).toBe('Enter your name.');
      expect(V.name('Alex Chen')).toBe('');
    });
  });

  describe('username validation', () => {
    it('requires username', () => {
      expect(V.user('')).toBe('Choose a username.');
    });

    it('enforces length constraints (3 to 20)', () => {
      expect(V.user('ab')).toBe('Use 3–20 characters.');
      expect(V.user('a'.repeat(21))).toBe('Use 3–20 characters.');
      expect(V.user('valid_user')).toBe('');
    });

    it('enforces allowed characters', () => {
      expect(V.user('user!@#')).toBe('Use letters, numbers, . and _ only.');
      expect(V.user('user.name_123')).toBe('');
    });
  });

  describe('email validation', () => {
    it('requires email', () => {
      expect(V.email('')).toBe('Enter your email.');
    });

    it('validates email format', () => {
      expect(V.email('invalid')).toBe('Enter a valid email address.');
      expect(V.email('test@')).toBe('Enter a valid email address.');
      expect(V.email('test@domain')).toBe('Enter a valid email address.');
      expect(V.email('test@example.com')).toBe('');
    });
  });

  describe('password validation', () => {
    it('requires password', () => {
      expect(V.pw('')).toBe('Create a password.');
    });

    it('requires at least 8 characters', () => {
      expect(V.pw('Pass1')).toBe('Use at least 8 characters.');
    });

    it('requires both letters and numbers', () => {
      expect(V.pw('abcdefgh')).toBe('Include a letter and a number.');
      expect(V.pw('12345678')).toBe('Include a letter and a number.');
      expect(V.pw('Password123')).toBe('');
    });
  });

  describe('date of birth validation', () => {
    it('requires date', () => {
      expect(V.dob('')).toBe('Enter your date of birth.');
    });

    it('enforces minimum age of 13', () => {
      const today = new Date().toISOString().slice(0, 10);
      expect(V.dob(today)).toBe('You must be at least 13 to join Phiny.');
      expect(V.dob('1995-05-15')).toBe('');
    });
  });

  describe('password strength calculator', () => {
    it('scores password complexity appropriately', () => {
      expect(strength('weak')).toBeLessThan(3);
      expect(strength('Pass1234!')).toBeGreaterThanOrEqual(4);
    });
  });
});
