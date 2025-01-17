import { useLoaderData, useParams } from "react-router-dom";
import Attempt from "../../components/Attempt";
import Navbar from "../../components/Navbar";
import SignedInNavbar from "../../components/SignedInNavbar";
import "../../css/attempts.css";
import useLocalStorageUserData from "../../hooks/useLocalStorageUserData";
import { IAttempt } from "../../utils/IAttempt";

export default function Attempts() {
  const { userData } = useLocalStorageUserData();
  const { quizId } = useParams();
  type LoaderDataType = { error?: string | null; data?: boolean; attempts: IAttempt[] | null };
  const { error, data, attempts } = useLoaderData() as LoaderDataType;

  return error || data === false || attempts === null ? (
    <h1>{error || "No attempts found."}</h1>
  ) : (
    <>
      {userData ? <SignedInNavbar fname={userData.fname} lname={userData.lname} /> : <Navbar />}
      <section className="attempts-container">
        <div className="section-title">
          <h1>Attempts for quiz {quizId}</h1>
          <hr />
        </div>
        {attempts.length === 0 ? (
          <p>No attempts for this quiz yet.</p>
        ) : (
          attempts.map((attempt) => <Attempt key={attempt.id} attempt={attempt} />)
        )}
      </section>
    </>
  );
}
