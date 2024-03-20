import { useState, useEffect } from "preact/hooks";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import PlayerBoard from "./GameModules/PlayerCommandCenter";
import OpponentBoard from "./GameModules/Singleplayer/OpponentBoard";
import PlayerShips from "./assets/PlayerShips";
import PlayerFace from "./assets/PlayerFace.svg";
import BotFace from "./assets/BotFace.svg";
import GameHeader from "./assets/game-header.png";
import GameFooter from "./assets/game-footer.svg";
import {
  generateContinuousArrayHorizontal,
  generateContinuousArrayVertical,
  wait,
  getRandomExcluding,
  checkValidStartIndex,
} from "./helper/utils";
import { MessageService } from "./services/MessagingService";

const TOTAL_COORDINATES = 17;
let PlayerTimer: number;
let BotTimer: number;

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

function SinglePlayer() {
  const navigate = useNavigate();
  const [gamePayload, setGamePayload] = useState<any>(null);
  const [isGameComplete] = useState<boolean>(false);
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
  const [playerTime, setPlayerTime] = useState<number>(10);

  useEffect(() => {
    if (playerReady) {
      PlayerTimer = setInterval(() => {
        setPlayerTime((prev) => prev - 1);
      }, 1000);
      if (Math.floor(playerTime) === 0) {
        clearInterval(PlayerTimer);
        setPlayerTime(10);
        setPlayerReady(false);
        setOpponentReady(true);
      }
      return () => {
        clearInterval(PlayerTimer);
      };
    }
  }, [playerTime, playerReady]);

  /* Bot info */
  const [opponentReady, setOpponentReady] = useState(false);
  const [startGame, setStartGame] = useState(false);
  const [botShipsPlacement, setBotShipsPlacement] = useState(false);
  const [currentScore, setCurrentScore] = useState<any>({
    player: 0,
    bot: 0,
  });
  // const [botTime, setBotTime] = useState<number>(10);

  // useEffect(() => {
  //   if (opponentReady) {
  //     BotTimer = setInterval(() => {
  //       setBotTime((prev) => prev - 1);
  //     }, 1000);
  //     if (Math.floor(botTime) === 0) {
  //       clearInterval(BotTimer);
  //     }
  //     return () => {
  //       clearInterval(BotTimer);
  //     };
  //   }
  // }, [botTime, opponentReady]);
  useEffect(() => {
    if (opponentReady) {
      clearInterval(PlayerTimer);
      setPlayerTime(10);
    }
  }, [opponentReady]);
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 120,
      tolerance: 20,
    },
  });
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      delay: 200,
      tolerance: 20,
    },
  });
  const sensors = useSensors(touchSensor, mouseSensor);

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
    const excludeCells = Object.keys(playerCellStatus).filter(
      (el: number | string) =>
        playerCellStatus[el] === "MISS" || playerCellStatus[el] === "HIT"
    );
    const randomIndex = getRandomExcluding(62, 0, excludeCells);
    computerFiresMissle(randomIndex);
  }, [playerReady]);

  useEffect(() => {
    const allPlacedCoordinates = Object.values(playerShipsCoordinates).flat(1);
    setPlacedCoordinates(allPlacedCoordinates);
  }, [playerShipsCoordinates]);

  useEffect(() => {
    handlePlayerWinScenario(startGame, playerShipsCoordinates);
  }, [playerShipsCoordinates, startGame]);

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

  function computerFiresMissle(cell: number) {
    setTimeout(() => {
      const playerCoordinates = { ...playerShipsCoordinates };
      if (!playerReady && opponentReady) {
        if (placedCoordinates.includes(cell)) {
          setPlayerCellStatus((prev) => ({ ...prev, [cell]: "HIT" }));
          for (let ship in playerCoordinates) {
            if (playerCoordinates[ship].includes(cell)) {
              toast.success(`Your ${ship} has been hit!`);
              setPlayerSunkShipsCoordinates((prev: Array<number>) => [
                ...prev,
                cell,
              ]);
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

  function handlePlayerWinScenario(
    currentGameStatus: boolean,
    shipsPlacement: any
  ) {
    if (
      currentGameStatus &&
      Object.values(shipsPlacement).flat(1).length === 0
    ) {
      toast.success(`Bot won!`);
      try {
        const newPayload = {
          ...gamePayload,
          status: "completed",
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
        // if (mode !== "0") {
        //   sendEndGameStats(newPayload);
        // }
        navigate(
          `/singleplayer?exit=true&data=${btoa(JSON.stringify(newPayload))}`
        );
        window.location.reload();
      } catch (error) {
        return false;
      }
    }
  }

  function handleShipDrop(event: any) {
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
  }

  function handlePlayerReadyScenario() {
    if (
      Object.values(playerShipsCoordinates).flat(1).length === TOTAL_COORDINATES
    ) {
      if (Object.values(isShipValid).every((el) => el === true)) {
        setBotShipsPlacement(true);
        wait(2000).then(() => {
          setPlayerReady(true);
          setBotShipsPlacement(false);
          setStartGame(true);
        });
      } else {
        toast.error(`Please place all your trucks correctly!`);
      }
    } else {
      toast.error(`Please place all your trucks first!`);
    }
  }

  function handleExit() {
    if (!isGameComplete) {
      const newPayload = {
        ...gamePayload,
        status: "abandoned",
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
      };
      navigate(
        `/singleplayer?exit=true&data=${btoa(JSON.stringify(newPayload))}`
      );
      MessageService.sendGameEndMessage(btoa(JSON.stringify(newPayload)));
      window.location.reload();
    }
  }

  function handleAssignRandom(trucks: any) {
    const cellsAlreadyOccupied: Array<Array<number>> = [];
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
    for (let i = 0; i < trucks.length; i++) {
      const randomStartIndex = Math.floor(Math.random() * (62 - 0 + 1)) + 0;
      const isHorizontal = Math.random() < 0.5;
      if (isHorizontal) {
        const newRandomStartIndex = checkValidStartIndex(
          randomStartIndex,
          trucks[i].length,
          cellsAlreadyOccupied,
          "HORIZONTAL"
        );
        const newShipPlacement = generateContinuousArrayHorizontal(
          newRandomStartIndex,
          trucks[i].length
        );
        cellsAlreadyOccupied.push(newShipPlacement);
        const startCell = document.getElementById(`${newRandomStartIndex}`);
        const currentShip = document.getElementById(`${trucks[i].shipType}`);
        if (currentShip) {
          // currentShip?.classList.add("truck-arrive");
          currentShip.style.position = "relative";
          currentShip.style.top = "-10px";
          startCell?.append(currentShip);
          setPlayerShipsCoordinates((prev: any) => ({
            ...prev,
            [trucks[i].shipType]: newShipPlacement,
          }));
        }
      }
      if (!isHorizontal) {
        const newRandomStartIndex = checkValidStartIndex(
          randomStartIndex,
          trucks[i].length,
          cellsAlreadyOccupied,
          "VERTICAL"
        );
        const newShipPlacement = generateContinuousArrayVertical(
          newRandomStartIndex,
          trucks[i].length
        );
        cellsAlreadyOccupied.push(newShipPlacement);
        const startCell = document.getElementById(`${newRandomStartIndex}`);
        const currentShip = document.getElementById(`${trucks[i].shipType}`);
        if (currentShip) {
          // currentShip?.classList.add("truck-arrive");
          currentShip.style.position = "absolute";
          currentShip.style.top = "10px";
          startCell?.append(currentShip);
          setPlayerShipsOrientation((prev) => ({
            ...prev,
            [trucks[i].shipType]: "V",
          }));
          setIsHorizontal((prev: any) => ({
            ...prev,
            [trucks[i].shipType]: false,
          }));
          setPlayerShipsCoordinates((prev: any) => ({
            ...prev,
            [trucks[i].shipType]: newShipPlacement,
          }));
        }
      }
    }
    cellsAlreadyOccupied.splice(0);
  }

  return (
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
                !playerReady ? "scale-75 opacity-40 transition-all" : ""
              }`}
              src={PlayerFace}
              alt=""
            />
            {playerReady ? (
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

      <section
        className="relative game-center pt-[60px] pb-[60px]"
        id="game-center"
      >
        {startGame ? (
          <div id="player-time">
            <div
              style={{
                height: playerTime === 0 ? `100%` : `${playerTime * 10}%`,
                width: "100%",
                background: "rgba(200,0,0,0.4)",
                transition: "height 1s ease-in",
              }}
            ></div>
          </div>
        ) : null}
        {!startGame && !botShipsPlacement ? (
          <div className="flex flex-col gap-1.5 p-4">
            {!window.matchMedia("(min-device-width : 769px)").matches ? (
              <>
                <h2 className="funky-font text-3xl">
                  Deploy <br />
                  Your Trucks
                </h2>
                <p className="text-sm uppercase opacity-50">
                  drag to move and tap to rotate, you can also pick “assign
                  random”
                </p>
              </>
            ) : null}
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
          onDragEnd={handleShipDrop}
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
              />
            ) : null}
            {botShipsPlacement ? (
              <h1 className="text-md funky-font flex h-[200px] animate-pulse items-center justify-center text-white opacity-30">
                Bot is placing their trucks
              </h1>
            ) : null}
          </div>
        </DndContext>
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
        {/* <div id="bot-time">
          <div
            style={{
              height: botTime === 0 ? "0%" : `${100 - botTime * 10}%`,
              width: "100%",
              background: "white",
              transition: "height 1s ease-in",
              transform: "rotate(180deg)",
            }}
          ></div>
        </div> */}
      </section>

      <footer className="fixed bottom-0 w-full z-[2]">
        <img
          className="absolute top-0 -z-[1] h-full w-full object-cover object-top"
          src={GameFooter}
          alt=""
        />
        <div className="flex h-full items-center justify-end gap-5">
          {opponentReady ? (
            <span className="funky-font text-xl">{currentScore?.bot}</span>
          ) : null}
          <img
            className={`${
              !opponentReady ? "scale-75 opacity-40 transition-all" : ""
            }`}
            src={BotFace}
            alt=""
            width={70}
          />
        </div>
      </footer>
    </main>
  );
}

export default SinglePlayer;

/*
  Player's turn goes up, reducing the height of the internal div
  Bot's turn goes down, increasing the height of the internal div
*/
