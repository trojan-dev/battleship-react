import { useState } from "preact/hooks";
import { useNavigate } from "react-router-dom";
function HomePage() {
  const [playerName, setPlayerName] = useState<string>("");
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center items-center w-[90%] mx-auto text-white p-2 h-screen">
      <h1 className="text-6xl text-center">Battlecity</h1>
      <h2>Onwards to glory!</h2>
      <label htmlFor="player" className="mt-10 mb-5">
        Enter your name
      </label>
      <input
        className="text-black p-2"
        type="text"
        name=""
        id="player"
        value={playerName}
        onChange={(e: any) => setPlayerName(e.target.value)}
      />
      <div className="flex justify-center my-10 gap-10 w-full">
        <button
          onClick={() => {
            localStorage.setItem("battleship-player", playerName);
            navigate("/singleplayer");
          }}
          disabled={!playerName.length}
          className="border basis-2/12 p-2 rounded-md hover:opacity-80"
        >
          Practice
        </button>
        <button
          onClick={() => {
            localStorage.setItem("battleship-player", playerName);
            navigate("/multiplayer");
          }}
          disabled={!playerName.length}
          className="border basis-2/12 p-2 rounded-md hover:opacity-80"
        >
          1V1
        </button>
      </div>
    </div>
  );
}

export default HomePage;
