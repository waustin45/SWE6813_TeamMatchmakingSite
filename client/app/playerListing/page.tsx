
import PlayerListing from '../components/PlayerListing';
import { getAllGames } from '../serverActions/playerListingPage/getGames';
import { getAllPlayers } from '../serverActions/playerListingPage/getPlayers';
import { getAllTags } from '../serverActions/playerListingPage/getTags';
const page = async () => {
  const playersRet = await getAllPlayers()
  const gamesRet = await getAllGames()
  const tagsRet = await getAllTags()

  if (!playersRet.success || !playersRet.data) {
    return <div className="alert alert-danger">Error loading players.</div>;
  }
  const players = playersRet.data;
  const games = gamesRet.data;
  const tags = tagsRet.data;


  
  return (
    <main className="m-4">
      <PlayerListing players={players} games={games} tags={tags} />
    </main>
  )
}

export default page