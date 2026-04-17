
import UserDataInterface from '@/interfaces/userDataInterface';
import Link from 'next/link';
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

  if(!players || !games || !tags) return <>Error Loading</>


  
  return (
    <main className="m-4">
      <div className='d-flex justify-content-end w-100'>
        <Link className='btn btn-secondary shadow' href={'/match-feed'}>Find Players that match your style</Link>
      </div>
      <PlayerListing players={players! as UserDataInterface[]} games={games} tags={tags} />
    </main>
  )
}

export default page