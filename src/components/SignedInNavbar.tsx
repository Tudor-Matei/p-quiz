import { useCallback, useContext, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserDataContext } from "../utils/UserDataContext";

export default function SignedInNavbar({ fname, lname }: { fname: string; lname: string }) {
  const navbarRef = useRef<HTMLElement>(null);
  const { setUserData } = useContext(UserDataContext);
  const { pathname } = useLocation();

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

  const logOutHandler = useCallback(() => {
    fetch("http://localhost/p-quiz/php/logout.php", { method: "POST", credentials: "include" })
      .then((response) => response.json())
      .then(({ error }: { error: string | null }) => {
        if (error !== null && error !== "User is not logged in.") {
          alert(error);
          return;
        }

        localStorage.removeItem("data");
        setUserData(null);
        location.pathname = "/";
      });
  }, [setUserData]);

  return (
    <nav ref={navbarRef}>
      <h1 className="main-title" data-text={`hi, ${fname} ${lname}`}>
        hi, {fname} {lname}
      </h1>

      <div className="nav__buttons">
        <button onClick={logOutHandler} className="default-button">
          Log out
        </button>
        {pathname === "/dashboard" ? (
          <Link to="/quizzes">
            <button className="primary-button">See quizzes</button>
          </Link>
        ) : (
          <Link to="/dashboard">
            <button className="primary-button">Go Home</button>
          </Link>
        )}
      </div>
    </nav>
  );
}
