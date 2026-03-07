import { Profile } from "@/app/components/Navbar";
import { Dispatch, SetStateAction } from "react";

const checkUser = async (setUser: Dispatch<SetStateAction<Profile | null>>) => {
    const res = await fetch('/api/auth/profile'); // Calling your GET function above
    if (res.ok) {
      const data = await res.json();
      setUser(data.user); // Now you have user.gamerTag!
    }
}

export default checkUser;