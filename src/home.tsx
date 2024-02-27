import { useEffect } from "preact/hooks";
import { useNavigate } from "react-router-dom";
const SINGLE_PLAYER_BASE64 =
  "ewogICAgImdhbWVUeXBlIjogIkNMQVNTSUMiLAogICAgImdhbWVOYW1lIjogIkJhdHRsZWNpdHkiLAogICAgImdhbWVJRCI6ICI2NWM5MmI2YTdiYmY0MjhjMjUxMzg3NTYiLAogICAgIm1vZGUiOiAwLAogICAgImJldFBsYWNlZCI6IDAsCiAgICAicGxheWVycyI6IFsKICAgICAgICB7CiAgICAgICAgICAgICJ1c2VybmFtZSI6ICJEaHJ1djcwIiwKICAgICAgICAgICAgIl9pZCI6ICI2NWI5ZjQ1ZTI4NjdjMTI5ZDI2MThmNTMiLAogICAgICAgICAgICAiYXZhdGFyIjogIm5pbCIKICAgICAgICB9CiAgICBdLAogICAgInJlc3VsdHMiOiBbXSwKICAgICJhZGRpdGlvbmFsIjoge30sCiAgICAiY2hhbGxlbmdlcyI6IHt9Cn0=";
const MULTIPLAYER_BASE64 =
  "ewogICAgImdhbWVUeXBlIjogIkNMQVNTSUMiLAogICAgImdhbWVOYW1lIjogIkJhdHRsZWNpdHkiLAogICAgImdhbWVJRCI6ICI2NWM5MmI2YTdiYmY0MjhjMjUxMzg3NTYiLAogICAgIm1vZGUiOiAxLAogICAgImJldFBsYWNlZCI6IDAsCiAgICAicGxheWVycyI6IFsKICAgICAgICB7CiAgICAgICAgICAgICJ1c2VybmFtZSI6ICJEaHJ1djcwIiwKICAgICAgICAgICAgIl9pZCI6ICI2NWI5ZjQ1ZTI4NjdjMTI5ZDI2MThmNTMiLAogICAgICAgICAgICAiYXZhdGFyIjogIm5pbCIKICAgICAgICB9CiAgICBdLAogICAgInJlc3VsdHMiOiBbXSwKICAgICJhZGRpdGlvbmFsIjoge30sCiAgICAiY2hhbGxlbmdlcyI6IHt9Cn0=";
const searchParams = import.meta.env.DEV
  ? MULTIPLAYER_BASE64
  : new URLSearchParams(window.location.search)?.get("data");
function HomePage() {
  const navigate = useNavigate();
  useEffect(() => {
    if (searchParams) {
      const { mode } = JSON.parse(atob(searchParams));
      switch (mode) {
        case 0: {
          navigate(`/singleplayer?data=${searchParams}`);
          break;
        }
        case 1: {
          navigate(`/multiplayer?data=${searchParams}`);
          break;
        }
        default:
          break;
      }
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
