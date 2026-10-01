import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ImageUploader } from '@/components/ui/ImageUploader';

describe('Component: ImageUploader', () => {
  it('renders default label and hint when empty', () => {
    render(<ImageUploader value="" onChange={() => {}} />);
    expect(screen.getByText('Add image')).toBeInTheDocument();
    expect(screen.getByText('Drag and drop, or browse')).toBeInTheDocument();
  });

  it('REGRESSION: supports custom label for pin creation context', () => {
    render(
      <ImageUploader
        value=""
        onChange={() => {}}
        label="Add post image"
        hint="Upload JPG, PNG, WebP"
        altText="Preview of your post"
      />
    );
    expect(screen.getByText('Add post image')).toBeInTheDocument();
    expect(screen.getByText('Upload JPG, PNG, WebP')).toBeInTheDocument();
  });

  it('renders preview image and Replace/Remove buttons when value is set', () => {
    const handleChange = vi.fn();
    render(
      <ImageUploader
        value="data:image/png;base64,mockimagedata"
        onChange={handleChange}
        altText="Uploaded pin preview"
      />
    );

    const img = screen.getByAltText('Uploaded pin preview');
    expect(img).toBeInTheDocument();

    const removeBtn = screen.getByRole('button', { name: 'Remove' });
    fireEvent.click(removeBtn);
    expect(handleChange).toHaveBeenCalledWith('');
  });
});
