import { useEffect } from "preact/hooks";
import { useNavigate } from "react-router-dom";
const searchParams = import.meta.env.DEV
  ? "ewogICAgImdhbWVUeXBlIjogIkNMQVNTSUMiLAogICAgImdhbWVOYW1lIjogIkJhdHRsZWNpdHkiLAogICAgImdhbWVJRCI6ICI2NWM5MmI2YTdiYmY0MjhjMjUxMzg3NTYiLAogICAgIm1vZGUiOiAwLAogICAgImJldFBsYWNlZCI6IDAsCiAgICAicGxheWVycyI6IFsKICAgICAgICB7CiAgICAgICAgICAgICJ1c2VybmFtZSI6ICJEaHJ1djcwIiwKICAgICAgICAgICAgIl9pZCI6ICI2NWI5ZjQ1ZTI4NjdjMTI5ZDI2MThmNTMiLAogICAgICAgICAgICAiYXZhdGFyIjogIm5pbCIKICAgICAgICB9CiAgICBdLAogICAgInJlc3VsdHMiOiBbXSwKICAgICJhZGRpdGlvbmFsIjoge30sCiAgICAiY2hhbGxlbmdlcyI6IHt9Cn0="
  : new URLSearchParams(window.location.search)?.get("data");
function HomePage() {
  const navigate = useNavigate();
  useEffect(() => {
    if (searchParams) {
      navigate(`/singleplayer?data=${searchParams}`);
    }
  }, [searchParams]);

  if (!searchParams) {
    return (
      <p className="text-white align-center">
        Something went wrong loading the game.
      </p>
    );
  }

  return null;
}

export default HomePage;
