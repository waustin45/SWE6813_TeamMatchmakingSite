import MatchInvite from "@/app/components/MatchInvite";
import { getUserData } from "@/app/serverActions/playerListingPage/getUserData";
import UserDataInterface from "@/interfaces/userDataInterface";

const page = async({ 
  params
}: { 
  params: { id: number }
}) => {
  const { id } = await params;
  const userData = await getUserData(id);
  if (!userData || !userData.data) {
  return <div>User not found</div>; 
}

return (
    <div>
      <MatchInvite userData={userData!.data as UserDataInterface} />
    </div>
  );
}

export default page