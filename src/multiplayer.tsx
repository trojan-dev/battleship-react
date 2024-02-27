import { io } from "socket.io-client";
import { useState, useEffect } from "preact/hooks";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  DndContext,
  TouchSensor,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import PlayerBoard from "./GameModules/PlayerCommandCenter";
import OpponentBoard from "./GameModules/Multiplayer/OpponentBoard";
import PlayerShips from "./assets/PlayerShips";
import PlayerFace from "./assets/PlayerFace.svg";
import BotFace from "./assets/BotFace.svg";
import GameHeader from "./assets/game-header.png";
import GameFooter from "./assets/game-footer.svg";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";

const TOTAL_COORDINATES = 17;
const DUMMY_ROOM_ID = "65969992a6e67c6d75cf938b";
const shipPlacements: Array<Array<number>> = [];
const invalidCells: any = {
  CARRIER: [
    5, 6, 7, 8, 14, 15, 16, 17, 23, 24, 25, 26, 32, 33, 34, 35, 41, 42, 43, 44,
    50, 51, 52, 53, 59, 60, 61, 62,
  ],
  BATTLESHIP: [
    6, 7, 8, 15, 16, 17, 24, 25, 26, 33, 34, 35, 42, 43, 44, 51, 52, 53, 61, 62,
  ],
  CRUISER: [7, 8, 16, 17, 25, 26, 34, 35, 43, 44, 52, 53, 61, 62],
  DESTROYER: [7, 8, 16, 17, 25, 26, 34, 35, 43, 44, 52, 53, 61, 62],
  SUBMARINE: [8, 17, 26, 35, 44, 53, 62],
};
let clock: string | null = null;

function Multiplayer() {
  const [userSocketInstance, setUserSocketInstance] = useState<any>(null);

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 120,
      tolerance: 20,
    },
  });
  const sensors = useSensors(touchSensor);
  const navigate = useNavigate();
  const [gamePayload, setGamePayload] = useState<any>(null);
  const [isGameComplete] = useState<boolean>(false);
  const [startTimer, setStartTimer] = useState(false);
  const [timer, setTimerValue] = useState(3);
  const [showExitModal, setShowExitModal] = useState<boolean>(false);

  /* Current player info */
  const [playerReady, setPlayerReady] = useState(false);
  const [playerShipsCoordinates, setPlayerShipsCoordinates] = useState<any>({
    BATTLESHIP: [],
    CARRIER: [],
    CRUISER: [],
    DESTROYER: [],
    SUBMARINE: [],
  });
  const [playerSunkShipsCoordinates, setPlayerSunkShipsCoordinates] =
    useState<any>([]);
  const [playerShipsOrientation, setPlayerShipsOrientation] = useState<any>({
    BATTLESHIP: "H",
    CARRIER: "H",
    CRUISER: "H",
    DESTROYER: "H",
    SUBMARINE: "H",
  });
  const [isHorizontal, setIsHorizontal] = useState({
    BATTLESHIP: true,
    CARRIER: true,
    CRUISER: true,
    DESTROYER: true,
    SUBMARINE: true,
  });
  const [isShipValid, setIsShipValid] = useState({
    BATTLESHIP: true,
    CARRIER: true,
    CRUISER: true,
    DESTROYER: true,
    SUBMARINE: true,
  });
  const [placedCoordinates, setPlacedCoordinates] = useState<any>([]);
  const [playerCellStatus, setPlayerCellStatus] = useState<Array<any>>(
    [...Array(100).keys()].map(() => "EMPTY")
  );
  const [cellAnimationStatus, setCellAnimationStatus] = useState<Array<any>>(
    [...Array(100).keys()].map(() => "STOP")
  );

  /* Current opponent info */
  const [opponentReady, setOpponentReady] = useState(false);
  const [opponentPlacedShips, setOpponentPlacedShips] = useState<any>({});
  const [opponentCoordinates, setOpponentCoordinates] = useState([]);

  /* Start game */
  const [startGame, setStartGame] = useState(false);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [opponentTurn, setOpponentTurn] = useState(false);
  const [currentScore, setCurrentScore] = useState<any>({
    player: 0,
    opponent: 0,
  });

  function checkWhichShipGotSunk() {
    if (startGame) {
      for (let ship in playerShipsCoordinates) {
        if (!playerShipsCoordinates[ship].length) {
          toast.error(`Your ${ship} got sunk`);
          setCurrentScore((prev: any) => ({
            ...prev,
            opponent: prev.opponent + 1,
          }));
          return true;
        }
      }
      return "";
    }
  }

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
    const allPlacedCoordinates = Object.values(playerShipsCoordinates).flat(1);
    setPlacedCoordinates(allPlacedCoordinates);
  }, [playerShipsCoordinates]);

  useEffect(() => {
    const socket =
      import.meta.env.MODE === "development"
        ? io(`http://localhost:3000`)
        : io(`https://battleship-server-socket.onrender.com`);
    socket.on("connect", () => {
      setUserSocketInstance(socket);
      toast.success(
        `You have connected to the server with socket ${socket.id}`,
        {
          duration: 2000,
        }
      );
    });
    socket.on("receive-opponent-status", (message: any) => {
      const { coordinates, shipsPlacement, playerReady } = message;
      setOpponentPlacedShips(shipsPlacement);
      setOpponentCoordinates(coordinates);
      setOpponentReady(playerReady);
    });

    socket.on("send-cell-info", (message: any) => {
      const { cell, strike, opponentShips } = message;
      // Update player's board situation after opponent hit
      setPlayerCellStatus((prev) => ({ ...prev, [cell]: strike }));
      setPlayerShipsCoordinates(opponentShips);
      setPlayerTurn(true);
      setOpponentTurn(false);
      checkWhichShipGotSunk();
    });

    socket.on("disconnect", () => {
      toast.error(`You seem to be disconnected from the server!`);
    });

    return () => {
      socket.off("receive-opponent-status");
      socket.off("send-cell-info");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (playerReady && opponentReady) {
      setStartGame(true);
    }
  }, [playerReady, opponentReady]);

  useEffect(() => {
    if (startGame && !Object.values(playerShipsCoordinates).flat().length) {
      toast.error(`You lost!`);
      if (gamePayload) {
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
              userID: gamePayload?.players[1]?._id,
              endResult: "winner",
              score: currentScore.opponent,
            },
          ],
          players: [gamePayload.players[0], gamePayload.players[1]],
        };

        sendEndGameStats(newPayload);

        navigate(
          `/multiplayer?exit=true&data=${btoa(JSON.stringify(newPayload))}`
        );
        window.location.reload();
      } else {
        navigate(`/multiplayer?exit=true`);
      }
    }
  }, [playerShipsCoordinates]);

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

  // Ship drop algo
  const newHandleShipDrop = (event: any) => {
    /* The new algo for deciding the drop coordinates of the ship */
    const {
      collisions,
      active: {
        id,
        data: {
          current: { length },
        },
      },
      over,
    } = event;
    if (over?.id === "player-ships") {
      /* If player starts dragging and dropping in the same region */
      return false;
    }
    setIsShipValid((prev) => ({ ...prev, [id]: true }));
    if (!collisions.length || collisions.length < length) {
      return false;
    }
    const playerCoordinates = { ...playerShipsCoordinates };
    // Reset if the current dragged ship has any existing coordinates
    setPlayerShipsCoordinates((prev: any) => ({ ...prev, [id]: [] }));
    let generatedCoordinatesForTruck: Array<number> = [];
    if (playerShipsOrientation[id] === "H") {
      generatedCoordinatesForTruck = generateContinuousArrayHorizontal(
        over?.id,
        length
      );
    } else {
      generatedCoordinatesForTruck = generateContinuousArrayVertical(
        over?.id,
        length
      );
    }
    if (generatedCoordinatesForTruck.some((el) => el > 62)) {
      setIsShipValid((prev) => ({ ...prev, [id]: false }));
    }
    /* Out of bounds edge case WIP */
    if (
      invalidCells[id].includes(over?.id) &&
      playerShipsOrientation[id] === "H"
    ) {
      setIsShipValid((prev) => ({ ...prev, [id]: false }));
    }

    /* Overlapping edge case */
    for (const key in playerCoordinates) {
      if (key !== id) {
        if (
          playerCoordinates[key].some((el: number) =>
            generatedCoordinatesForTruck.includes(el)
          )
        ) {
          setIsShipValid((prev) => ({ ...prev, [id]: false }));
        }
      }
    }
    const draggedTruck = document.getElementById(id);
    const startIndex = document.getElementById(over?.id);
    if (draggedTruck) {
      if (playerShipsOrientation[id] === "H") {
        draggedTruck.style.position = "relative";
        draggedTruck.style.top = "-10px";
        draggedTruck.style.left = "5px";
      } else {
        draggedTruck.style.position = "absolute";
        draggedTruck.style.top = "10px";
      }
      startIndex?.appendChild(draggedTruck);
      setPlayerShipsCoordinates((prev: any) => ({
        ...prev,
        [id]: generatedCoordinatesForTruck,
      }));
    }
  };

  // Run this after player has confirmed their ships
  const handlePlayerReadyScenario = () => {
    if (
      Object.values(playerShipsCoordinates).flat(1).length === TOTAL_COORDINATES
    ) {
      if (Object.values(isShipValid).every((el) => el === true)) {
        userSocketInstance.emit(
          "player-ready",
          playerShipsCoordinates,
          placedCoordinates,
          true // Player is ready. This needs to be conveyed to the opponent
        );
        setPlayerReady(true);
      } else {
        toast.error(`Please place all your trucks correctly!`);
      }
    } else {
      toast.error(`Please place all your trucks first!`);
    }
  };

  const handleExit = () => {
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
            userID: gamePayload?.players[1]?._id,
            endResult: "winner",
            score: currentScore.opponent,
          },
        ],
      };
      navigate(
        `/multiplayer?exit=true&data=${btoa(JSON.stringify(newPayload))}`
      );
      window.location.reload();
    }
  };

  function checkValidStartIndex(
    index: number,
    truckLength: number,
    alreadyPlacedCells: Array<Array<number>>
  ) {
    if (
      index % 9 < truckLength &&
      !alreadyPlacedCells.flat(1).includes(index) &&
      !alreadyPlacedCells.flat(1).includes(index + truckLength - 1)
    ) {
      return index;
    }
    return checkValidStartIndex(
      Math.floor(Math.random() * (62 - 0 + 1)) + 0,
      truckLength,
      alreadyPlacedCells
    );
  }
  function generateContinuousArrayHorizontal(start: number, length: number) {
    return Array.from({ length: length }, (_, index) => start + index);
  }
  function generateContinuousArrayVertical(start: number, length: number) {
    return Array.from({ length: length }, (_, index) => start + 9 * index);
  }
  const handleAssignRandom = (ships: any) => {
    setPlayerShipsOrientation({
      BATTLESHIP: "H",
      CARRIER: "H",
      CRUISER: "H",
      DESTROYER: "H",
      SUBMARINE: "H",
    });
    setIsHorizontal({
      BATTLESHIP: true,
      CARRIER: true,
      CRUISER: true,
      DESTROYER: true,
      SUBMARINE: true,
    });
    setIsShipValid({
      BATTLESHIP: true,
      CARRIER: true,
      CRUISER: true,
      DESTROYER: true,
      SUBMARINE: true,
    });
    for (let i = 0; i < ships.length; i++) {
      const randomStartIndex = Math.floor(Math.random() * (62 - 0 + 1)) + 0;
      const newRandomStartIndex = checkValidStartIndex(
        randomStartIndex,
        ships[i].length,
        shipPlacements
      );
      const newShipPlacement = generateContinuousArrayHorizontal(
        newRandomStartIndex,
        ships[i].length
      );
      shipPlacements.push(newShipPlacement);
      const startCell = document.getElementById(newRandomStartIndex);
      const currentShip = document.getElementById(`${ships[i].shipType}`);
      if (currentShip) {
        // currentShip?.classList.add("truck-arrive");
        currentShip.style.position = "relative";
        currentShip.style.top = "-10px";
        startCell?.append(currentShip);
        setPlayerShipsCoordinates((prev: any) => ({
          ...prev,
          [ships[i].shipType]: newShipPlacement,
        }));
      }
    }
    shipPlacements.length = 0;
  };

  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragEnd={newHandleShipDrop}
    >
      <main className="container-fluid relative text-white">
        <Toaster />

        <header className="fixed top-0 flex w-full items-center justify-between z-[2]">
          <img
            className="absolute top-0 -z-[1] h-full w-full"
            src={GameHeader}
            alt=""
          />
          {startGame ? (
            <div className="flex items-center gap-5">
              <img
                width={50}
                className={`ml-2 mt-2 ${
                  !opponentTurn && playerTurn
                    ? "scale-75 opacity-40 transition-all"
                    : ""
                }`}
                src={PlayerFace}
                alt=""
              />
              {!opponentTurn && playerTurn ? (
                <span className="funky-font mt-2 text-xl">
                  {currentScore?.player}
                </span>
              ) : null}
            </div>
          ) : (
            <img width={50} src={PlayerFace} className="ml-2 mt-2" />
          )}
          <button
            onClick={() => setShowExitModal(true)}
            className="mb-4 mr-2 rounded-md p-1 text-sm"
          >
            Exit Game
          </button>
        </header>

        <section className="relative game-center pt-[60px] pb-[60px]">
          {!startGame && !playerReady ? (
            <div className="flex flex-col gap-1.5 p-1.5">
              <h2 className="funky-font text-3xl">
                Deploy <br />
                Your Trucks
              </h2>
              <p className="text-sm uppercase opacity-50">
                drag to move and tap to rotate, you can also pick “assign
                random”
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleAssignRandom(PlayerShips)}
                  className="save-order rounded-md p-2 text-xs font-medium"
                >
                  Assign Random
                </button>
                <button
                  onClick={() => handlePlayerReadyScenario()}
                  className="save-order rounded-md p-2 text-xs font-medium"
                >
                  Save Order
                </button>
              </div>
            </div>
          ) : null}
          <DndContext
            // onDragEnd={handleShipDrop}
            onDragEnd={newHandleShipDrop}
            // onDragOver={(event) => console.log("sdasd", event)}
            sensors={sensors}
            modifiers={[restrictToWindowEdges]}
          >
            <div className={`relative grid grid-cols-1 p-2 xl:grid-cols-2`}>
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
                playerSunkShipsCoordinates={playerSunkShipsCoordinates}
                setPlayerShipsCoordinates={setPlayerShipsCoordinates}
                setIsShipValid={setIsShipValid}
                isShipValid={isShipValid}
                isHorizontal={isHorizontal}
                setIsHorizontal={setIsHorizontal}
                invalidCells={invalidCells}
              />
              {startGame ? (
                <OpponentBoard
                  socket={userSocketInstance}
                  startGame={startGame}
                  playerReady={playerReady}
                  opponentReady={opponentReady}
                  setPlayerReady={setPlayerReady}
                  setOpponentReady={setOpponentReady}
                  gamePayload={gamePayload}
                  currentScore={currentScore}
                  setCurrentScore={setCurrentScore}
                  playerSunkShipsCoordinates={playerSunkShipsCoordinates}
                  cellAnimationStatus={cellAnimationStatus}
                  setCellAnimationStatus={setCellAnimationStatus}
                  opponentPlacedShips={opponentPlacedShips}
                  opponentCoordinates={opponentCoordinates}
                  setOpponentPlacedShips={setOpponentPlacedShips}
                  setOpponentTurn={setOpponentTurn}
                  setPlayerTurn={setPlayerTurn}
                  playerTurn={playerTurn}
                  opponentTurn={opponentTurn}
                  sendEndGameStats={sendEndGameStats}
                />
              ) : null}
              {playerReady && !opponentReady ? (
                <h1 className="text-sm funky-font mt-5 h-[100px] animate-pulse text-center text-white opacity-30">
                  Waiting for player to join in and place their ships
                </h1>
              ) : null}
              {/* <progress value={40}></progress> */}
            </div>
          </DndContext>
          {/* {startTimer ? (
            <div className="absolute left-0 top-0 z-[222] grid h-[100%] w-full place-items-center backdrop-blur-md">
              <div className="flex flex-col items-center justify-center gap-2">
                <span className="funky-font text-5xl">{timer}</span>
                <p className="funky-font text-3xl">Get Ready!</p>
              </div>
            </div>
          ) : null} */}
          {showExitModal ? (
            <div
              className="absolute top-0 z-[99999] grid h-screen w-full place-items-center
      bg-black text-white"
            >
              <div className="flex flex-col items-center justify-center gap-5 p-1">
                <h1 className="funky-font text-xl">
                  Are you sure you want to quit?
                </h1>
                <div className="flex gap-5">
                  <button
                    className="funky-font text-xl"
                    onClick={() => handleExit()}
                  >
                    Yes
                  </button>
                  <button
                    className="funky-font text-xl"
                    onClick={() => setShowExitModal(false)}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </section>

        <footer className="fixed bottom-0 w-full z-[2]">
          <img
            className="absolute top-0 -z-[1] h-full w-full object-cover object-top"
            src={GameFooter}
            alt=""
          />
          <div className="flex h-full items-center justify-end gap-5">
            {opponentTurn && !playerTurn ? (
              <span className="funky-font text-xl">
                {currentScore?.opponent}
              </span>
            ) : null}
            <img
              className={`${
                opponentTurn && !playerTurn
                  ? "scale-75 opacity-40 transition-all"
                  : ""
              }`}
              src={BotFace}
              alt=""
              width={70}
            />
          </div>
        </footer>
      </main>
    </DndContext>
  );
}

export default Multiplayer;
/*
<main className="container-fluid text-white p-3">
        <Toaster />
        <section className="container mx-auto">
          {!startGame ? (
            <div className="flex flex-col md:flex-row my-5 gap-10">
              <div>
                <h1 className="text-4xl ">Deploy your ships</h1>
                <h2 className="text-white opacity-60">
                  drag to move and tap the rotate button to rotate.
                </h2>

                <div className="flex gap-2 my-2">
                  {!playerReady ? (
                    <button
                      className={`border basis-3/12 p-2 rounded-md`}
                      onClick={() => handlePlayerReadyScenario()}
                    >
                      Confirm
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-1 lg:grid-cols-2">
            <PlayerBoard
              placedShips={placedCoordinates}
              playerShipsCoordinates={playerShipsCoordinates}
              playerCellStatus={playerCellStatus}
              startGame={startGame}
              playerReady={playerReady}
              opponentReady={opponentReady}
              playerTurn={playerTurn}
              opponentTurn={opponentTurn}
            />

            <OpponentBoard
              socket={userSocketInstance}
              startGame={startGame}
              playerReady={playerReady}
              opponentReady={opponentReady}
              opponentPlacedShips={opponentPlacedShips}
              opponentCoordinates={opponentCoordinates}
              setOpponentPlacedShips={setOpponentPlacedShips}
              setOpponentTurn={setOpponentTurn}
              setPlayerTurn={setPlayerTurn}
              playerTurn={playerTurn}
              opponentTurn={opponentTurn}
            />
          </div>
          {startGame ? (
            <div className="flex justify-center p-1">
              <p className="text-md">
                {playerTurn ? "Your Turn" : "Opponent's Turn"}
              </p>
            </div>
          ) : null}
        </section>
      </main>


*/
