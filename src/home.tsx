import { useEffect, useState } from "preact/hooks";
import { TailSpin } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
const searchParams = import.meta.env.DEV
  ? "ewogICAgImdhbWVUeXBlIjogIkNMQVNTSUMiLAogICAgImdhbWVOYW1lIjogIkJhdHRsZWNpdHkiLAogICAgImdhbWVJRCI6ICI2NWM5MmI2YTdiYmY0MjhjMjUxMzg3NTYiLAogICAgIm1vZGUiOiAwLAogICAgImJldFBsYWNlZCI6IDAsCiAgICAicGxheWVycyI6IFsKICAgICAgICB7CiAgICAgICAgICAgICJ1c2VybmFtZSI6ICJEaHJ1djcwIiwKICAgICAgICAgICAgIl9pZCI6ICI2NWI5ZjQ1ZTI4NjdjMTI5ZDI2MThmNTMiLAogICAgICAgICAgICAiYXZhdGFyIjogIm5pbCIKICAgICAgICB9CiAgICBdLAogICAgInJlc3VsdHMiOiBbXSwKICAgICJhZGRpdGlvbmFsIjoge30sCiAgICAiY2hhbGxlbmdlcyI6IHt9Cn0="
  : new URLSearchParams(window.location.search)?.get("data");
function HomePage() {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (searchParams) {
      setIsLoaded(true);
      setTimeout(() => {
        navigate(`/singleplayer?data=${searchParams}`);
        setIsLoaded(false);
      }, 3000);
    }
  }, [searchParams]);

  if (!searchParams && !isLoaded) {
    return (
      <p className="text-white align-center">
        Something went wrong loading the game.
      </p>
    );
  }

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="flex flex-col gap-3">
        <TailSpin
          visible={true}
          height="80"
          width="80"
          color="#ffffff"
          ariaLabel="tail-spin-loading"
          radius="3"
        />
        <h2 className="text-white text-xl">Loading</h2>
      </div>
    </div>
  );
}

export default HomePage;
