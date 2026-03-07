import Image from "next/image";
import Link from "next/link";

export default function LearnMore() {
    return (
        <main className="py-5">
            
                <section>
                    <div className="container col-xxl-8 px-4 py-5 text-black">
                        <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
                            <div className="col-10 col-sm-8 col-lg-6">
                                <Image src="/gaming-togethera.png" className="d-block mx-lg-auto " alt="Gaming Together" width="600" height="500" loading="lazy"></Image>
                            </div>
                            <div className="col-lg-6">
                                <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">A new way to play</h1>
                                <p className="lead">A platform available to many communities and authentic human connection. Whether you're a beginner or a pro gamer,
                                    there's a community for you here. Let's create it together.</p>

                            </div>
                        </div>
                    </div>
                </section>
             

            <section>
                <div className="container col-xxl-8 px-4 py-5">
                    <div className="row flex-lg-row align-items-center g-5 py-5">
                        <div className="col-10 col-sm-8 col-lg-6">
                            <Image src="/controller.jpg" className="d-block rounded mx-auto" alt="Bootstrap Themes" width="500" height="300" loading="lazy"></Image>
                        </div>
                        <div className="col-lg-6">
                            <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">How does it work?</h1>
                            <p className="lead">People around the world add a game to the their list, update their profile and preferences. We filter their gaming preferences.</p>
                            
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="container col-xxl-8 px-4 py-5">
                    <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
                        <div className="col-10 col-sm-8 col-lg-6">
                            <Image src="/game-night.jpg" className="d-block rounded mx-auto" alt="Bootstrap Themes" width="500" height="300" loading="lazy"></Image>
                        </div>
                        <div className="col-lg-6">
                            <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">Add a game</h1>
                            <p className="lead">Users can add a game to the the list they're currently playing.</p>
                            
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="container col-xxl-8 px-4 py-5">
                    <div className="row flex-lg-row align-items-center g-5 py-5">
                        <div className="col-10 col-sm-8 col-lg-6">
                            <Image src="/game-night2.png" className="d-block rounded mx-auto" alt="Bootstrap Themes" width="450" height="500" loading="lazy"></Image>
                        </div>
                        <div className="col-lg-6">
                            <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">Update profile and preferences</h1>
                            <p className="lead">Update your preferences to find the best gaming experiences with others in your community.</p>
                            
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="container col-xxl-8 px-4 py-5">
                    <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
                        <div className="col-10 col-sm-8 col-lg-6">
                            <Image src="/game-night3.png" className="d-block rounded mx-auto" alt="Bootstrap Themes" width="450" height="500" loading="lazy"></Image>
                        </div>
                        <div className="col-lg-6">
                            <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">We filter your match</h1>
                            <p className="lead">We offer suggested players who match your profile preferences.</p>

                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}