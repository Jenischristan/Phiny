import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ImageCard } from '@/components/feed/ImageCard';
import { PhinyProvider } from '@/context/PhinyContext';
import { Post } from '@/types';

const mockPin: Post = {
  id: 42,
  title: 'Brutalist Geometry',
  by: { id: 3, name: 'Sofia Rinaldi', handle: 'sofiar', fers: 10, state: 'active' },
  tag: 'Architecture',
  seed: 4,
  ratio: 1.33,
  date: '2d ago',
  likes: 12,
  vis: 'public',
  comments: true,
};

describe('Component: ImageCard', () => {
  it('renders pin title and image', () => {
    render(
      <PhinyProvider>
        <ImageCard pin={mockPin} />
      </PhinyProvider>
    );

    expect(screen.getByText('Brutalist Geometry')).toBeInTheDocument();
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
  });

  it('REGRESSION: renders semantic Link to post detail page', () => {
    render(
      <PhinyProvider>
        <ImageCard pin={mockPin} />
      </PhinyProvider>
    );

    const postLink = screen.getByRole('link', { name: 'Open Brutalist Geometry' });
    expect(postLink).toBeInTheDocument();
    expect(postLink).toHaveAttribute('href', '/post/42');
  });

  it('REGRESSION: renders semantic Link to creator profile', () => {
    render(
      <PhinyProvider>
        <ImageCard pin={mockPin} />
      </PhinyProvider>
    );

    const creatorLink = screen.getByRole('link', { name: 'Sofia Rinaldi' });
    expect(creatorLink).toBeInTheDocument();
    expect(creatorLink).toHaveAttribute('href', '/profile/3');
  });

  it('allows saving and unsaving the pin', () => {
    render(
      <PhinyProvider>
        <ImageCard pin={mockPin} />
      </PhinyProvider>
    );

    const saveBtn = screen.getByRole('button', { name: 'Save' });
    expect(saveBtn).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(saveBtn);
    expect(saveBtn).toHaveTextContent('Saved');
    expect(saveBtn).toHaveAttribute('aria-pressed', 'true');
  });
});
