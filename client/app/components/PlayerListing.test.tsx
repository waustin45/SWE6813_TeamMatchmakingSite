import GameDataInterface from '@/interfaces/gameDataInterface';
import TagDataInterface from '@/interfaces/tagDataInterface';
import UserDataInterface from '@/interfaces/userDataInterface';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import PlayerListing from './PlayerListing';

const mockGames = [
  { id: 1, name: 'Valorant' },
  { id: 2, name: 'Apex Legends' },
] as GameDataInterface[];

const mockTags = [
  { id: 1, label: 'FPS', color: 'danger' },
] as TagDataInterface[];

const mockPlayers = [
  {
    id: 1,
    gamerTag: 'Vortex',
    bio: 'Entry fragger',
    games: [mockGames[0]],
    tags: [mockTags[0]],
  },
  {
    id: 2,
    gamerTag: 'Shadow',
    bio: 'Support flex',
    games: [mockGames[1]],
    tags: [mockTags[0]],
  },
] as UserDataInterface[];

describe('PlayerListing Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders all players initially', () => {
    render(<PlayerListing players={mockPlayers} games={mockGames} tags={mockTags} />);
    
    expect(screen.getByText('@Vortex')).toBeDefined();
    expect(screen.getByText('@Shadow')).toBeDefined();
    expect(screen.getByText('Find Your Squad')).toBeDefined();
  });

  it('filters players by Gamertag search term', () => {
    render(<PlayerListing players={mockPlayers} games={mockGames} tags={mockTags} />);
    
    const searchInput = screen.getByPlaceholderText('e.g. Vortex...');
    fireEvent.change(searchInput, { target: { value: 'Vortex' } });
    
    const searchButton = screen.getByRole('button', { name: 'Search' });
    fireEvent.click(searchButton);

    expect(screen.getByText('@Vortex')).toBeDefined();
    expect(screen.queryByText('@Shadow')).toBeNull();
  });

  it('filters players by selected game', () => {
    render(<PlayerListing players={mockPlayers} games={mockGames} tags={mockTags} />);
    
    // 2 represents the ID for "Apex Legends" in our mock data
    const gameSelect = screen.getByRole('combobox');
    fireEvent.change(gameSelect, { target: { value: '2' } });
    
    const searchButton = screen.getByRole('button', { name: 'Search' });
    fireEvent.click(searchButton);

    expect(screen.queryByText('@Vortex')).toBeNull();
    expect(screen.getByText('@Shadow')).toBeDefined();
  });

  it('clears all filters when Clear All is clicked', () => {
    render(<PlayerListing players={mockPlayers} games={mockGames} tags={mockTags} />);
    
    // Apply a filter first
    const searchInput = screen.getByPlaceholderText('e.g. Vortex...');
    fireEvent.change(searchInput, { target: { value: 'Vortex' } });
    const searchButton = screen.getByRole('button', { name: 'Search' });
    fireEvent.click(searchButton);

    // Assert only one is visible
    expect(screen.queryByText('@Shadow')).toBeNull();

    // Click Clear All
    const clearButton = screen.getByRole('button', { name: 'Clear All' });
    fireEvent.click(clearButton);

    // Assert both are back and inputs are cleared
    expect(screen.getByText('@Vortex')).toBeDefined();
    expect(screen.getByText('@Shadow')).toBeDefined();
    expect((searchInput as HTMLInputElement).value).toBe('');
  });
});