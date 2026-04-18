import MatchInvite from "@/app/components/MatchInvite";
import { getUserData } from "@/app/serverActions/playerListingPage/getUserData";
import UserDataInterface from "@/interfaces/userDataInterface";
import UserDataReturn from "@/interfaces/userDataReturn";

interface userDataDTO {
  success: boolean;
  data: UserDataInterface
}


const page = async({ 
  params
}: { 
  params: { id: number }
}) => {
  const { id } = await params;
  const userData: UserDataReturn = await getUserData(id);
  if (!userData || !userData.data) {
  return <div>User not found</div>; 
}

return (
    <div>
      <MatchInvite userData={userData!.data} />
    </div>
  );
}

export default page