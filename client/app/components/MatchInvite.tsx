'use client'
import { startConversation } from "@/app/messages/actions";
import UserDataInterface from "@/interfaces/userDataInterface";
import Image from "next/image";
import { useState } from "react";

export default function MatchInvite({ userData }: { userData: UserDataInterface }) {
    const [message, setMessage] = useState("")
    const [error, setError] = useState<string | null>(null)

    async function sendMessage() {
        const result = await startConversation(userData.id, message)
        if ("error" in result) {
            setError(result.error)
        } else {
            setMessage("")
            setError(null)
        }
    }
    return (
        <main className="min-vh-100 d-flex align-items-center justify-content-center">
            <div className="text-center">

                <main className="px-3 mb-4 py-5">
                    <h1 className="mb-5">You have a potential match!</h1>
                    

                    <div className="d-flex justify-content-center py-3 ">
                        <div className="card" style={{ width: "20rem" }}>
                            <Image src={userData.avatarUrl ? userData.avatarUrl : "/female_profile.jpg"} alt="Matched player card" width={150} height={290} className="card-img-top" />
                            <div className="card-body">
                                <h5 className="card-title">{userData.gamerTag}</h5>
                                <p>Atlanta, GA</p>
                                <p className="card-text">{userData.bio}</p>
                                
                                <div className="container text-center">
                                    <div className="row align-items-end ">
                            
                                    <p className="col card-small-text"> 10 Similar Games Played</p>
                                    <p className="col card-small-text">7 Similar Preferences</p>
                                    </div>
                                </div>

                                <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="form-control mt-3" rows={3} placeholder="Type your message here..."></textarea>
                                {error && <p className="text-danger mt-2">{error}</p>}
                                <div className="d-flex justify-content-center gap-2 mt-3">
                                    
                                {/* <Link href="/profile" className="btn btn-lg px-4 gradient-purple-btn">Accept Invite</Link> */}
                                <button onClick={sendMessage} className="btn btn-lg px-4 gradient-purple-btn w-100">Send Message</button>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </main>

    );
}