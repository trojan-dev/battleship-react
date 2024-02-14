const searchParams = new URLSearchParams(window.location.search);
function ResultsPage() {
  return (
    <div className="h-screen flex flex-col gap-5 justify-center items-center">
      <h1 className="text-white text-4xl">
        {searchParams.get("isWinner") === "true" ? "You Won!" : "You Lost!"}
      </h1>
      <h2 className="text-white text-2xl">
        Your Score : {searchParams.get("playerScore")}
      </h2>
      <h2 className="text-white text-2xl">
        Bot Score : {searchParams.get("botScore")}
      </h2>
    </div>
  );
}

export default ResultsPage;
