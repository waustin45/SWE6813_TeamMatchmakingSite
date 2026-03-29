import prisma from '@/lib/prisma';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { getAllGames } from './getGames';

vi.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    game: {
      findMany: vi.fn(),
    },
  },
}));

describe('getAllGames', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should return games on success', async () => {
    const mockGames = [{ id: 1, name: 'Valorant' }];
    (prisma.game.findMany as Mock).mockResolvedValue(mockGames);

    const result = await getAllGames();

    expect(prisma.game.findMany).toHaveBeenCalled();
    expect(result).toEqual({ success: true, data: mockGames });
  });

  it('should return error on failure', async () => {
    (prisma.game.findMany as Mock).mockRejectedValue(new Error('Database error'));

    const result = await getAllGames();

    expect(console.error).toHaveBeenCalledWith('Failed to fetch games:', expect.any(Error));
    expect(result).toEqual({ success: false, error: 'Internal Server Error' });
  });
});