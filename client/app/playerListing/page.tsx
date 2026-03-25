
import PlayerListing from '../components/PlayerListing';
import games from './testGamesData.json';
import players from './testPlayerData.json';
import tags from './testTagsData.json';
const page = () => {

  
  return (
    <main className="m-4">
      <PlayerListing players={players} games={games} tags={tags} />
    </main>
  )
}

export default page