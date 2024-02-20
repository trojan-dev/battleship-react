import { useState, useEffect } from "preact/hooks";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { DndContext, rectIntersection } from "@dnd-kit/core";
import PlayerBoard from "./GameModules/PlayerCommandCenter";
import OpponentBoard from "./GameModules/Singleplayer/OpponentBoard";
import PlayerFace from "./assets/PlayerFace.svg";
import BotFace from "./assets/BotFace.svg";

const TOTAL_COORDINATES = 17;
const DUMMY_ROOM_ID = "65969992a6e67c6d75cf938b";

function SinglePlayer() {
  const navigate = useNavigate();
  const [gamePayload, setGamePayload] = useState<any>(null);
  const [isGameComplete] = useState<boolean>(false);
  /* Current player info */
  const [playerReady, setPlayerReady] = useState(false);
  const [playerShipsCoordinates, setPlayerShipsCoordinates] = useState<any>({
    BATTLESHIP: [],
    CARRIER: [],
    CRUISER: [],
    DESTROYER: [],
    SUBMARINE: [],
  });
  const [playerShipsOrientation, setPlayerShipsOrientation] = useState<any>({
    BATTLESHIP: "H",
    CARRIER: "H",
    CRUISER: "H",
    DESTROYER: "H",
    SUBMARINE: "H",
  });
  const [placedCoordinates, setPlacedCoordinates] = useState<any>([]);
  const [playerCellStatus, setPlayerCellStatus] = useState<Array<any>>(
    [...Array(100).keys()].map(() => "EMPTY")
  );

  /* Bot info */
  const [opponentReady, setOpponentReady] = useState(false);

  const [startGame, setStartGame] = useState(false);
  const [botShipsPlacement, setBotShipsPlacement] = useState(false);
  const [currentScore, setCurrentScore] = useState<any>({
    player: 0,
    bot: 0,
  });

  const [setShowExitModal] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search).get(
      "data"
    );
    if (searchParams) {
      const decoded = JSON.parse(atob(searchParams));
      setGamePayload(decoded);
    }
  }, []);

  useEffect(() => {
    computerFiresMissle(Math.floor(Math.random() * (62 - 0 + 1) + 0));
  }, [playerReady]);

  useEffect(() => {
    if (
      startGame &&
      Object.values(playerShipsCoordinates).flat(1).length === 0
    ) {
      toast.success(`Bot won!`);
      if (gamePayload) {
        const { mode } = gamePayload;
        const newPayload = {
          ...gamePayload,
          gameStatus: "completed",
          gameUrl: window.location.host,
          result: [
            {
              userID: gamePayload?.players[0]?._id,
              endResult: "loser",
              score: currentScore.player,
            },
            {
              userID: "bot",
              endResult: "winner",
              score: currentScore.bot,
            },
          ],
          players: [gamePayload.players[0]],
        };
        if (mode !== "0") {
          sendEndGameStats(newPayload);
        }
        navigate(
          `/singleplayer?exit=true&data=${btoa(JSON.stringify(newPayload))}`
        );
        window.location.reload();
      } else {
        navigate(`/singleplayer?exit=true`);
      }
    }
  }, [playerShipsCoordinates, startGame]);

  useEffect(() => {
    const allPlacedCoordinates = Object.values(playerShipsCoordinates).flat(1);
    setPlacedCoordinates(allPlacedCoordinates);
  }, [playerShipsCoordinates]);

  function checkIfPlayerShipSank(ship: any) {
    if (!playerShipsCoordinates[ship].length) {
      toast.success(`Opponent sank your ${ship}`);
      setCurrentScore((prev: any) => ({ ...prev, bot: prev.bot + 1 }));
      setTimeout(() => {
        setPlayerReady(true);
        setOpponentReady(false);
      }, 1500);
    }
  }

  function wait(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  function computerFiresMissle(cell: number) {
    setTimeout(() => {
      const playerCoordinates = { ...playerShipsCoordinates };
      if (!playerReady && opponentReady) {
        if (placedCoordinates.includes(cell)) {
          setPlayerCellStatus((prev) => ({ ...prev, [cell]: "HIT" }));
          for (let ship in playerCoordinates) {
            if (playerCoordinates[ship].includes(cell)) {
              toast.success(`Your ${ship} has been hit!`);
              let idx = playerCoordinates[ship].findIndex(
                (el: any) => el === cell
              );
              playerCoordinates[ship].splice(idx, 1);
              setPlayerShipsCoordinates(playerCoordinates);
              checkIfPlayerShipSank(ship);
            }
          }
        } else {
          setPlayerCellStatus((prev) => ({ ...prev, [cell]: "MISS" }));
        }
        wait(1500).then(() => {
          setOpponentReady(false);
          setPlayerReady(true);
        });
      }
    }, 2000);
  }

  async function sendEndGameStats(payload: Response) {
    try {
      const response = await fetch(
        `http://65.2.34.81:3000/sdk/conclude/${DUMMY_ROOM_ID}`,
        {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const output = await response.json();
      return output;
    } catch (error) {
      console.error(error);
    }
  }

  // Check if ships are overlapping with each other while placement
  const checkIfShipCollision = (
    currentShipBlocks: Array<any>,
    currentShip: any
  ) => {
    const mutatedSortedCollisionsArray = currentShipBlocks.map((el) => el.id);

    // Condition for a ship that is already dragged;
    if (playerShipsCoordinates[currentShip].length > 0) {
      if (
        playerShipsCoordinates[currentShip].every((el: any) =>
          currentShipBlocks.includes(el)
        )
      ) {
        return true;
      } else {
        // Condition for a dragged ship that can be moved across the board
        for (let ship in playerShipsCoordinates) {
          if (
            ship !== currentShip &&
            playerShipsCoordinates[ship].some((el: any) =>
              mutatedSortedCollisionsArray.includes(el)
            )
          ) {
            return true;
          }
        }
        return false;
      }
    } else {
      // Condition for a new ship that hasnt been dragged yet.
      for (let ship in playerShipsCoordinates) {
        if (
          playerShipsCoordinates[ship].some((el: any) =>
            mutatedSortedCollisionsArray.includes(el)
          )
        ) {
          return true;
        }
      }
      return false;
    }
  };

  const handleShipDrop = (event: any) => {
    const { active, collisions, over } = event;
    if (collisions && over?.id !== "player-ships") {
      let sortedCollisions = collisions.sort((a: any, b: any) => a.id - b.id);

      /* In case the user is trying to drag outside the boundaries */
      if (sortedCollisions.length < active.data.current.length) {
        return false;
      }

      if (
        sortedCollisions.length > active.data.current.length &&
        playerShipsOrientation[active.id] === "H"
      ) {
        let differenceInShipLengthAndCollisions =
          sortedCollisions.length - active.data.current.length;

        sortedCollisions.splice(0, differenceInShipLengthAndCollisions);
      }

      if (
        sortedCollisions.length > active.data.current.length &&
        playerShipsOrientation[active.id] === "V"
      ) {
        let differenceInShipLengthAndCollisions =
          sortedCollisions.length - active.data.current.length;
        sortedCollisions.splice(0, differenceInShipLengthAndCollisions);
      }

      const draggedElement = document.getElementById(active.id);
      let shipStartIndex, ifCollision;
      if (draggedElement) {
        shipStartIndex = sortedCollisions[0].id;
        ifCollision = checkIfShipCollision(sortedCollisions, active.id);
        if (ifCollision) {
          return false;
        }
        const startIndexElement = document.getElementById(shipStartIndex);
        draggedElement.classList.add("truck-arrive");
        startIndexElement?.append(draggedElement);
        draggedElement.style.position = "relative";
        draggedElement.style.top = "-10px";
        draggedElement.style.left = "5px";
        setPlayerShipsCoordinates((prev: any) => ({
          ...prev,
          [active.id]: [...sortedCollisions.map((el: any) => el.id)],
        }));
      }
    }
  };

  // Run this after player has confirmed their ships
  const handlePlayerReadyScenario = () => {
    if (
      Object.values(playerShipsCoordinates).flat(1).length === TOTAL_COORDINATES
    ) {
      setBotShipsPlacement(true);
      setTimeout(() => {
        setPlayerReady(true);
        setStartGame(true);
        setBotShipsPlacement(false);
      }, 4000);
    } else {
      toast.error(`Please place all your ships first!`);
    }
  };

  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragEnd={handleShipDrop}
    >
      <main className="container-fluid text-white relative flex flex-col">
        <Toaster />

        <div className="relative flex justify-between items-center w-full game-header p-1">
          {startGame ? (
            <>
              <div className="flex items-center gap-2">
                {playerReady ? (
                  <span className="funky-font text-xl">
                    {currentScore?.player}
                  </span>
                ) : null}
                <img
                  width={50}
                  className={`${
                    !playerReady ? "transition-all scale-75 opacity-40" : ""
                  }`}
                  src={PlayerFace}
                  alt=""
                />
              </div>
            </>
          ) : (
            <>
              <img width={50} src={PlayerFace} alt="" />
            </>
          )}
          <button
            onClick={() => {
              if (!isGameComplete) {
                const newPayload = {
                  ...gamePayload,
                  status: "abandoned",
                  gameUrl: window.location.host,
                  results: [
                    {
                      userID: gamePayload?.players[0]?._id,
                      endResult: "loser",
                      score: currentScore.player,
                    },
                    {
                      userID: "bot",
                      endResult: "winner",
                      score: currentScore.bot,
                    },
                  ],
                };
                navigate(
                  `/singleplayer?exit=true&data=${btoa(
                    JSON.stringify(newPayload)
                  )}`
                );
                window.location.reload();
              }
            }}
            className="text-sm p-1 rounded-md"
          >
            Exit Game
          </button>
        </div>

        {!startGame && !botShipsPlacement ? (
          <div className="flex flex-col gap-1.5 p-1.5">
            <h2 className="funky-font text-3xl">
              Deploy <br />
              Your Trucks
            </h2>
            <p className="text-sm opacity-50 uppercase">
              drag to move and tap to rotate, you can also pick “assign random”
            </p>
            <div className="flex gap-3">
              {/* <button className="border p-1">Assign Random</button> */}
              <button
                onClick={() => handlePlayerReadyScenario()}
                className="save-order p-2 rounded-md text-xs font-medium"
              >
                Save Order
              </button>
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-2 mt-1 pl-1.5 pr-1.5">
          <PlayerBoard
            placedShips={placedCoordinates}
            playerShipsCoordinates={playerShipsCoordinates}
            playerCellStatus={playerCellStatus}
            startGame={startGame}
            playerReady={playerReady}
            opponentReady={opponentReady}
            setPlayerReady={setPlayerReady}
            setOpponentReady={setOpponentReady}
            playerShipsOrientation={playerShipsOrientation}
            setPlayerShipsOrientation={setPlayerShipsOrientation}
            currentScore={currentScore}
          />
          {startGame ? (
            <OpponentBoard
              startGame={startGame}
              playerReady={playerReady}
              opponentReady={opponentReady}
              setPlayerReady={setPlayerReady}
              setOpponentReady={setOpponentReady}
              gamePayload={gamePayload}
              currentScore={currentScore}
              setCurrentScore={setCurrentScore}
            />
          ) : null}

          {botShipsPlacement ? (
            <h1 className="text-white opacity-30 flex justify-center items-center h-[200px] text-xl animate-pulse">
              Bot is placing their trucks
            </h1>
          ) : null}
          {/* <progress value={40}></progress> */}
        </div>
        {/* {showExitModal ? (
          <div className="absolute transition-all top-0 left-0 w-full bg-black h-screen text-white flex flex-col justify-center items-center gap-2">
            <h1 className="text-2xl">Exit BattleThing?</h1>
            <p className="text-sm">Are you sure you want to exit the game?</p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowExitModal(false);
                }}
                className="p-1 rounded-md bg-red-600 w-[100px]"
              >
                No
              </button>
              <button className="p-1 rounded-md bg-green-600 w-[100px]">
                Yes
              </button>
            </div>
          </div>
        ) : null} */}
        <div className="flex fixed bottom-0 justify-end items-center z-[22] w-full game-footer">
          <div className="flex items-center gap-2">
            {opponentReady ? (
              <span className="funky-font text-xl">{currentScore?.bot}</span>
            ) : null}
            <img
              className={`${
                !opponentReady ? "transition-all scale-75 opacity-40" : ""
              }`}
              src={BotFace}
              alt=""
            />
          </div>
        </div>
      </main>
    </DndContext>
  );
}

export default SinglePlayer;
