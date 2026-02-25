import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main>
      <section className="min-vh-100 d-flex align-items-center">
        <div className="px-5 pt-5  text-center ">
          <h1 className="display-4 fw-bold text-body-emphasis">The Destination</h1>
          <div className="row">
            <div className="col-lg-6 mx-auto">
              <p className="lead mb-4">for players to connect and play video games</p>

            </div>
            <div className="row pt-5"></div>
            <div className="overflow-hidden" style={{ maxHeight: "30vh" }}>
              <div className="container px-5">
                <Image src="/generic_controller_a.png" className="img-fluid rounded shadow mb-4" alt="game controller" width="700" height="500" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </section>

<div className="gradient-purple gradient-sect">
      <section className="min-vh-100 d-flex align-items-center">
      <div className="container text-center">
        <h2 className="fw-bold mb-4">Trusted by Gamers</h2>

        <div className="row py-5">
          <div className="col-md-4">
            <h3 className="fw-bold stat-num">87%</h3>
            <p className="stat-lbl">Reduction in Toxic Matches</p>
          </div>

          <div className="col-md-4">
            <h3 className="fw-bold stat-num">500</h3>
            <p className="stat-lbl">Players Matched</p>
          </div>

          <div className="col-md-4">
            <h3 className="fw-bold stat-num">12+</h3>
            <p className="stat-lbl">Games Supported</p>
          </div>
        </div>
      </div>
    </section>

      <section>
        <div className="container px-4" id="icon-grid">
          <h2 className="pb-2 border-bottom fw-bold">Features</h2>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 py-5">
            <div className="col d-flex align-items-start">

              <div>
                <h3 className="fw-bold mb-0 fs-4 ">Custom Profile</h3>
                <p>Paragraph of text beneath the heading to explain the heading.</p>
              </div>
            </div>
            <div className="col d-flex align-items-start">

              <div>
                <h3 className="fw-bold mb-0 fs-4 ">Filtered Match</h3>
                <p>Paragraph of text beneath the heading to explain the heading.</p>
              </div>
            </div>
            <div className="col d-flex align-items-start">

              <div> <h3 className="fw-bold mb-0 fs-4 ">Community</h3>
                <p>Paragraph of text beneath the heading to explain the heading.</p>
              </div>
            </div>
            <div className="col d-flex align-items-start">

              <div> <h3 className="fw-bold mb-0 fs-4 ">Play Games Together</h3>
                <p>Paragraph of text beneath the heading to explain the heading.</p>
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
            <p className="lead mb-4">and let's build your own personal squad together</p>
            <div className="d-grid gap-2 d-sm-flex justify-content-sm-center mb-5">
              <button type="button" className="btn btn-primary btn-lg px-4 me-sm-3">Sign Up</button>
              
            </div>
          </div>
          
        </div>
      </div>
      </section>
</div>
    </main> 
  );
}
