import { useNavigate } from "react-router-dom";
function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center items-center w-[90%] mx-auto text-white p-2 h-screen">
      <h1 className="text-6xl text-center">Battlecity</h1>
      <div className="flex justify-center my-10 gap-10 w-full">
        <button
          onClick={() => {
            navigate("/singleplayer");
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
