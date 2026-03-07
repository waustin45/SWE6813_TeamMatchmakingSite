'use client';
import signOut from "@/helpers/signOut";

const page = () => {
  return (
    <div className="">
        <button className="btn btn-primary" >Profile Page</button>
        <button onClick={() => {
            signOut()
            }} className="btn btn-secondary">Sign Out</button>
    </div>
  )
}

export default page