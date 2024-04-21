import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "../../css/index.css";
import useRedirectOnAuth from "../../utils/useRedirectOnAuth";

export default function Home() {
  const isLoggedIn = useRedirectOnAuth("/dashboard", true);

  return isLoggedIn ? null : (
    <>
      <Navbar />
      <main className="landing">
        <h1 className="main-title" data-text="p-quiz">
          p-quiz
        </h1>
        <p>Your own personalised quiz-taking platform. It’s like the rest, but better. Trust us. You must.</p>

        <Link to="/signup">
          <button className="default-button call-to-action">Let's give this thing a shot</button>
        </Link>
      </main>

      <section className="are-you-tired">
        <aside>
          <h1>Tired of unclear ways to do things?</h1>
          <p>
            Creating and taking quizzes does not have to be a pain. We simply make it a little less of a headache,
            because that’s how it should be.
          </p>
          <Link to="/signup">
            <button className="default-button call-to-action">Let's give this thing a shot</button>
          </Link>
        </aside>

        <img src="src/assets/pondering.png" />
      </section>

      <section className="finally">
        <h1 className="main-title" data-text="Finally,">
          Finally,
        </h1>
        <h2>
          quiz making <span>&</span> taking is simple
        </h2>
        <p>
          With our intuitive layout, and ease of use, you will never have to worry about how you create a new quiz, as
          the professor. You just do.
        </p>

        <Link to="/signup">
          <button className="default-button call-to-action">Let's give this thing a shot</button>
        </Link>
      </section>

      <section className="get-in-touch">
        <h1>Want to get in touch?</h1>
        <p>Meet us here:</p>
        <div className="mapouter">
          <div className="gmap_canvas">
            <iframe
              width="770"
              height="510"
              id="gmap_canvas"
              src="https://maps.google.com/maps?q=timisoara&t=&z=10&ie=UTF8&iwloc=&output=embed"
              frameBorder="0"
              scrolling="no"
            ></iframe>
          </div>
        </div>
      </section>
    </>
  );
}
