import { useState, useEffect } from "preact/hooks";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { DndContext, rectIntersection } from "@dnd-kit/core";
import PlayerBoard from "./GameModules/PlayerCommandCenter";
import OpponentBoard from "./GameModules/Singleplayer/OpponentBoard";
import { calculateCellSize } from "./helper/SIZES";
import PlayerFace from "./assets/PlayerFace.svg";
import BotFace from "./assets/BotFace.svg";
import Canon from "./assets/canon.svg";
import BattleFog from "./assets/battle-fog.svg";

const TOTAL_COORDINATES = 17;
const BASE_CELL_SIZE = calculateCellSize();
const DUMMY_ROOM_ID = "65969992a6e67c6d75cf938b";
let CURRENT_SHIP_HITS: number[] = [];

function SinglePlayer() {
  const navigate = useNavigate();
  const [gamePayload, setGamePayload] = useState<any>(null);
  const [isGameComplete, setIsGameComplete] = useState<boolean>(false);
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
  // const [opponentPlacedShips, setOpponentPlacedShips] = useState<any>({});
  // const [opponentCoordinates, setOpponentCoordinates] = useState([]);

  const [startGame, setStartGame] = useState(false);
  const [botShipsPlacement, setBotShipsPlacement] = useState(false);
  const [currentScore, setCurrentScore] = useState<any>({
    player: 0,
    bot: 0,
  });

  /* AI logic for tracking ships */
  const [currentHitShip, setCurrentHitShip] = useState<any | null>({
    ship: null,
    hitCell: null,
    possibleCells: [],
  });

  const [showExitModal, setShowExitModal] = useState(false);

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
    // if (!currentHitShip?.ship) {
    computerFiresMissle(Math.floor(Math.random() * (62 - 0 + 1) + 0));
    // } else {
    //   computerFiresIntelligentMissile();
    // }
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

  useEffect(() => {}, [playerShipsCoordinates]);

  function checkIfPlayerShipSank(ship: any) {
    if (!playerShipsCoordinates[ship].length) {
      toast.success(`Opponent sank your ${ship}`);
      setCurrentScore((prev: any) => ({ ...prev, bot: prev.bot + 1 }));
      setCurrentHitShip({
        ship: null,
        possibleCells: [],
        trackedShip: [],
      });
    }
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
              if (!currentHitShip?.ship) {
                setCurrentHitShip({
                  ship: ship,
                  hitCell: cell,
                  trackedShip: [],
                });
                CURRENT_SHIP_HITS = [cell - 1, cell + 1, cell - 9, cell + 9];
              }
            }
          }
        } else {
          setPlayerCellStatus((prev) => ({ ...prev, [cell]: "MISS" }));
        }
        setOpponentReady(false);
        setPlayerReady(true);
      }
    }, 1200);
  }

  function computerFiresIntelligentMissile() {
    const randomMove = CURRENT_SHIP_HITS[0];
    computerFiresMissle(randomMove);
    CURRENT_SHIP_HITS.pop();
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
  // Check the actual position of the ship wrt to the board
  const calculateCellDistance = (start: any, shipType: string) => {
    let topDistance, leftDistance;
    if (playerShipsOrientation[shipType] === "H") {
      topDistance = `${Math.floor(start / 9) * BASE_CELL_SIZE - 15}px`;
      leftDistance = `${(start % 9) * BASE_CELL_SIZE + 2}px`;
      return { topDistance, leftDistance };
    }
    topDistance = `${Math.floor(start / 9) * BASE_CELL_SIZE}px`;
    leftDistance = `${(start % 7) * BASE_CELL_SIZE}px`;
    return { topDistance, leftDistance };
  };

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
        console.log("error");
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
        setPlayerShipsCoordinates((prev: any) => ({
          ...prev,
          [active.id]: [...sortedCollisions.map((el: any) => el.id)],
        }));
        setPlacedCoordinates((prev: any) => [
          ...prev,
          ...sortedCollisions.map((el: any) => el.id),
        ]);
        draggedElement.style.position = "absolute";
        let coordinates = calculateCellDistance(shipStartIndex, active.id);
        if (coordinates) {
          draggedElement.style.top = coordinates.topDistance;
          draggedElement.style.left = coordinates.leftDistance;
        }
      }
    }
    if (collisions && over?.id === "player-ships") {
      const draggedElement = document.getElementById(active.id);
      draggedElement.style.position = "relative";
      draggedElement.style.top = "0";
      draggedElement.style.left = "0";
      setPlayerShipsCoordinates((prev) => ({ ...prev, [active.id]: [] }));
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

  const handleExit = () => {
    setShowExitModal(true);
  };

  console.log(playerShipsCoordinates);

  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragEnd={handleShipDrop}
    >
      <main className="container-fluid text-white relative flex flex-col">
        <Toaster />

        <div className="relative flex justify-between items-center w-full game-header p-2">
          {startGame ? (
            <>
              <div className="flex items-center gap-2">
                {playerReady ? (
                  <span className="funky-font text-xl">
                    {currentScore?.player}
                  </span>
                ) : null}
                <img
                  width={60}
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

        <div className="grow grid grid-cols-1 lg:grid-cols-2 mt-2 pl-1.5 pr-1.5">
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
