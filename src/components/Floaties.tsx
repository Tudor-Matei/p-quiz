import { useEffect, useRef } from "react";

export default function Floaties() {
  const followerFloaty = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let didMoveMouse = false;
    function moveFloatyCircleOnMouse({ clientX, clientY }: { clientX: number; clientY: number }) {
      if (followerFloaty.current === null) return;

      if (!didMoveMouse) {
        followerFloaty.current.style.opacity = "0.6";
        didMoveMouse = true;
      }

      followerFloaty.current.style.left = `calc(${clientX}px - var(--floaty-circle-width) / 2)`;
      followerFloaty.current.style.top = `calc(${clientY}px - var(--floaty-circle-height) / 2)`;
    }

    document.addEventListener("mousemove", moveFloatyCircleOnMouse);
  }, []);

  return (
    <div className="floaty-circles">
      <div className="floaty-circles__circle"></div>
      <div className="floaty-circles__circle"></div>
      <div className="floaty-circles__circle"></div>
      <div className="floaty-circles__circle floaty-circles__circle--follower" ref={followerFloaty}></div>
    </div>
  );
}
