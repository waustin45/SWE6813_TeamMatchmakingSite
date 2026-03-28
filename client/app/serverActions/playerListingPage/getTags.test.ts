import prisma from '@/lib/prisma';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { getAllTags } from './getTags';

vi.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    tag: {
      findMany: vi.fn(),
    },
  },
}));

describe('getAllTags', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should return tags on success', async () => {
    const mockTags = [{ id: 1, name: 'FPS' }];
    (prisma.tag.findMany as Mock).mockResolvedValue(mockTags);

    const result = await getAllTags();

    expect(prisma.tag.findMany).toHaveBeenCalled();
    expect(result).toEqual({ success: true, data: mockTags });
  });

  it('should return error on failure', async () => {
    (prisma.tag.findMany as Mock).mockRejectedValue(new Error('Database error'));

    const result = await getAllTags();

    expect(console.error).toHaveBeenCalledWith('Failed to fetch tags:', expect.any(Error));
    expect(result).toEqual({ success: false, error: 'Internal Server Error' });
  });
});