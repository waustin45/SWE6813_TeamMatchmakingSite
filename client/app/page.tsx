import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <section>
        <div className="container col-xxl-8 px-4 py-5">
          <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
            <div className="col-10 col-sm-8 col-lg-6">
              <Image src="/playing-game.jpg" className="d-block rounded mx-auto" alt="Bootstrap Themes" width="500" height="300" loading="lazy"></Image>
            </div>
            <div className="col-lg-6">
              <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">The destination to find other gamers who match your vibe</h1>
              <p className="lead">We are here to help gamers connect with others using skill-level and playstyle for a better gaming experience.</p>
              <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                <Link href="/learn_more" className="btn btn-purple-outline btn-lg px-4 ">Learn More</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

<div className="gradient-purple gradient-sect text-black">
      <section className="min-vh-100 d-flex align-items-center">
      <div className="container text-center">
        <h2 className="fw-bold mb-4">Trusted by Gamers</h2>

        <div className="row py-5">
          <div className="col-md-4">
            <i className="bi bi-fire fs-1"></i>
            <h3 className="fw-bold stat-num">87%</h3>
            <p className="stat-lbl">Reduction in Toxic Matches</p>
          </div>

          <div className="col-md-4">
            <i className="bi bi-yin-yang fs-1"></i>
            <h3 className="fw-bold stat-num">500</h3>
            <p className="stat-lbl">Players Matched</p>
          </div>

          <div className="col-md-4">
            <i className="bi bi-dpad fs-1"></i>
            <h3 className="fw-bold stat-num">12+</h3>
            <p className="stat-lbl">Games Supported</p>
          </div>
        </div>
      </div>
    </section>

      <section>
        <div className="container px-4 " id="icon-grid">
          <h2 className="pb-2 text-center fw-bold">Features</h2>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-3 g-5 py-5">
            <div className="col d-flex align-items-start">

              <div>
                
                <h3 className="fw-bold mb-0 fs-4 "><i className="bi bi-person fs-3"></i>Custom Profile</h3>
                <p>Create a custom profile that shows your gaming style.</p>
              </div>
            </div>
            <div className="col d-flex align-items-start">

              <div>
                <h3 className="fw-bold mb-0 fs-4 "><i className="bi bi-funnel fs-3"></i>Filtered Match</h3>
                <p>Gamers are matched through filtered prefences.</p>
              </div>
            </div>
            <div className="col d-flex align-items-start">

              <div> <h3 className="fw-bold mb-0 fs-4 "><i className="bi bi-people fs-3"></i>Community</h3>
                <p>Connect with new people.</p>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      <section>
        <div className="px-4 pt-5 my-5 text-center border-bottom">
        <h1 className="display-4 fw-bold ">JOIN US</h1>
        <div className="row">
          <div className="col-lg-6 mx-auto">
            <p className="lead mb-4">and let us build your own personal squad together</p>
            <div className="d-grid gap-2 d-sm-flex justify-content-sm-center mb-5">
              <button type="button" className="btn btn-white-outline text-black btn-lg px-4 me-sm-3">Sign Up</button>
              
            </div>
          </div>
          
        </div>
      </div>
      </section>
</div>
    </main> 
  );
}
