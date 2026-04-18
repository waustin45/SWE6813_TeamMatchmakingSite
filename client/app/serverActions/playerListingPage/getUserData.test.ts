import prisma from '@/lib/prisma';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { getUserData } from './getUserData';

vi.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

describe('getUserData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should return player data on success', async () => {
    const mockPlayer = {
      id: 1,
      username: 'TestPlayer',
      games: [{ id: 1, name: 'Valorant' }],
      tags: [{ id: 1, name: 'FPS' }],
    };
    (prisma.user.findUnique as Mock).mockResolvedValue(mockPlayer);

    const result = await getUserData(1);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: {
        games: { include: { genres: true } },
        tags: true,
      },
    });
    expect(result).toEqual({ success: true, data: mockPlayer });
  });

  it('should return error on failure', async () => {
    (prisma.user.findUnique as Mock).mockRejectedValue(new Error('Database error'));

    const result = await getUserData(1);

    expect(console.error).toHaveBeenCalledWith('Failed to fetch player:', expect.any(Error));
    expect(result).toEqual({ success: false, error: 'Internal Server Error', data: null });
  });
});