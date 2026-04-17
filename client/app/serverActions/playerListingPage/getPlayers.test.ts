import prisma from '@/lib/prisma';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { getAllPlayers } from './getPlayers';

vi.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    user: {
      findMany: vi.fn(),
    },
  },
}));

describe('getAllPlayers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should return players on success', async () => {
    const mockPlayers = [{ id: 1, username: 'Player 1' }];
    (prisma.user.findMany as Mock).mockResolvedValue(mockPlayers);

    const result = await getAllPlayers();

    expect(prisma.user.findMany).toHaveBeenCalledWith({
      include: {
        games: { include: { genres: true } },
        tags: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    expect(result).toEqual({ success: true, data: mockPlayers });
  });

  it('should return error on failure', async () => {
    (prisma.user.findMany as Mock).mockRejectedValue(new Error('Database error'));

    const result = await getAllPlayers();

    expect(console.error).toHaveBeenCalledWith('Failed to fetch players:', expect.any(Error));
    expect(result).toEqual({ success: false, error: 'Internal Server Error' });
  });
});