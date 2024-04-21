import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const navbarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const navbarThresholdElement = document.querySelector(".navbar-delimiter") as HTMLDivElement;
    const navbarObserver = new IntersectionObserver(
      (entries) => {
        if (navbarRef.current === null) return;
        const navbarThresholdElementEntry = entries[0];
        if (!navbarThresholdElementEntry.isIntersecting) navbarRef.current.classList.add("nav--scrolling");
        else navbarRef.current.classList.remove("nav--scrolling");
      },
      { threshold: 1 }
    );

    navbarObserver.observe(navbarThresholdElement);
  }, []);

  return (
    <nav ref={navbarRef}>
      <Link to="/quizzes">
        <button className="default-button available-quizzes">
          Available quizzes <img src="/src/assets/Arrow 1.svg" />
        </button>
      </Link>

      <div className="nav__buttons">
        <Link to="/signup">
          <button className="default-button" id="signup">
            Sign up
          </button>
        </Link>
        <Link to="/signin">
          <button className="primary-button" id="signin">
            Sign in
          </button>
        </Link>
      </div>
    </nav>
  );
}
