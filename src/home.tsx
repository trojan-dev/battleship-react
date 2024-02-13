import { useNavigate } from "react-router-dom";
function HomePage() {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search).get("data");
  if (!searchParams) {
    return (
      <p className="text-white align-center">
        Something went wrong loading the game.
      </p>
    );
  }
  return (
    <div className="flex flex-col justify-center items-center w-[90%] mx-auto text-white p-2 h-screen">
      <h1 className="text-6xl text-center">Battlecity</h1>
      <div className="flex justify-center my-10 gap-10 w-full">
        <button
          onClick={() => {
            navigate(`/singleplayer?data=${searchParams}`);
          }}
          className="border basis-2/12 p-2 rounded-md hover:opacity-80"
        >
          Practice
        </button>
      </div>
    </div>
  );
}

export default HomePage;
