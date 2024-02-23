import { useState, useEffect } from "preact/hooks";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { DndContext, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import PlayerBoard from "./GameModules/PlayerCommandCenter";
import OpponentBoard from "./GameModules/Singleplayer/OpponentBoard";
import PlayerShips from "./assets/PlayerShips";
import PlayerFace from "./assets/PlayerFace.svg";
import BotFace from "./assets/BotFace.svg";
import GameHeader from "./assets/game-header.png";
import GameFooter from "./assets/game-footer.svg";

const TOTAL_COORDINATES = 17;
const DUMMY_ROOM_ID = "65969992a6e67c6d75cf938b";
const shipPlacements: Array<Array<number>> = [];

function SinglePlayer() {
  const touchSensor = useSensor(TouchSensor);
  const sensors = useSensors(touchSensor);
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

  /* Bot info */
  const [opponentReady, setOpponentReady] = useState(false);
  const [startGame, setStartGame] = useState(false);
  const [botShipsPlacement, setBotShipsPlacement] = useState(false);
  const [currentScore, setCurrentScore] = useState<any>({
    player: 0,
    bot: 0,
  });

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
    computerFiresMissle(
      getRandomExcluding(
        62,
        0,
        Object.keys(playerCellStatus).filter(
          (el) =>
            playerCellStatus[el] === "MISS" || playerCellStatus[el] === "HIT"
        )
      )
    );
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

  function getRandomExcluding(
    min: number,
    max: number,
    exclude: Array<string>
  ) {
    let randomNum;
    do {
      randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (exclude.includes(String(randomNum)));
    return randomNum;
  }

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
      setIsShipValid({
        BATTLESHIP: true,
        CARRIER: true,
        CRUISER: true,
        DESTROYER: true,
        SUBMARINE: true,
      });
      let sortedCollisions = collisions.sort((a: any, b: any) => a.id - b.id);

      /* In case the user is trying to drag outside the boundaries */
      if (sortedCollisions.length < active.data.current.length) {
        return false;
      }

      if (
        sortedCollisions.length >= active.data.current.length &&
        playerShipsOrientation[active.id] === "H"
      ) {
        let differenceInShipLengthAndCollisions =
          sortedCollisions.length - active.data.current.length;
        sortedCollisions.splice(0, differenceInShipLengthAndCollisions);
        const draggedElement = document.getElementById(active.id);
        let shipStartIndex, ifCollision;
        if (draggedElement) {
          shipStartIndex = sortedCollisions[0].id;
          ifCollision = checkIfShipCollision(sortedCollisions, active.id);
          if (ifCollision) {
            return false;
          }
          const startIndexElement = document.getElementById(shipStartIndex);
          // draggedElement.classList.add("truck-arrive");
          draggedElement.style.position = "relative";
          draggedElement.style.top = "-7px";
          draggedElement.style.left = "5px";
          startIndexElement?.append(draggedElement);
          setPlayerShipsCoordinates((prev: any) => ({
            ...prev,
            [active.id]: [...sortedCollisions.map((el: any) => el.id)],
          }));
        }
      }
      if (
        sortedCollisions.length >= active.data.current.length &&
        playerShipsOrientation[active.id] === "V"
      ) {
        let differenceInShipLengthAndCollisions =
          sortedCollisions.length - active.data.current.length;
        sortedCollisions.splice(
          active.data.current.length,
          differenceInShipLengthAndCollisions
        );

        const draggedElement = document.getElementById(active.id);
        let shipStartIndex, ifCollision;
        if (draggedElement) {
          shipStartIndex = sortedCollisions[0].id;
          ifCollision = checkIfShipCollision(sortedCollisions, active.id);
          if (ifCollision) {
            return false;
          }
          // const startIndexElement = document.getElementById(shipStartIndex);
          const startIndexElement = document.getElementById(over?.id);
          draggedElement.style.position = "absolute";
          // draggedElement.classList.add("truck-arrive-vertical");
          draggedElement.style.top = "10px";
          startIndexElement?.append(draggedElement);
          setPlayerShipsCoordinates((prev: any) => ({
            ...prev,
            [active.id]: [...sortedCollisions.map((el: any) => el.id)],
          }));
        }
      }
    }
  };

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
    if (!collisions.length || collisions.length < length) {
      return false;
    }
    const playerCoordinates = { ...playerShipsCoordinates };
    // Reset if the current dragged ship has any existing coordinates
    setPlayerShipsCoordinates((prev: any) => ({ ...prev, [id]: [] }));
    const generatedCoordinatesForTruck = generateContinuousArray(
      over?.id,
      length
    );
    /* Out of bounds edge case */

    /* Overlapping edge case */
    for (const key in playerCoordinates) {
      if (key !== id) {
        if (
          playerCoordinates[key].some((el: number) =>
            generatedCoordinatesForTruck.includes(el)
          )
        ) {
          return false;
        }
      }
    }
    const draggedTruck = document.getElementById(id);
    const startIndex = document.getElementById(over?.id);
    if (draggedTruck) {
      draggedTruck.style.position = "relative";
      draggedTruck.style.top = "-7px";
      draggedTruck.style.left = "5px";
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
        setBotShipsPlacement(true);
        setTimeout(() => {
          setPlayerReady(true);
          setStartGame(true);
          setBotShipsPlacement(false);
        }, 4000);
      } else {
        toast.error(`Please place all your ships correctly!`);
      }
    } else {
      toast.error(`Please place all your ships first!`);
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
            userID: "bot",
            endResult: "winner",
            score: currentScore.bot,
          },
        ],
      };
      navigate(
        `/singleplayer?exit=true&data=${btoa(JSON.stringify(newPayload))}`
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

  function hasElementOverflowed(container, element) {
    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    return (
      elementRect.left < containerRect.left ||
      elementRect.right > containerRect.right
    );
  }

  function generateContinuousArray(start: number, length: number) {
    return Array.from({ length: length }, (_, index) => start + index);
  }

  const handleAssignRandom = (ships: any) => {
    for (let i = 0; i < ships.length; i++) {
      const randomStartIndex = Math.floor(Math.random() * (62 - 0 + 1)) + 0;
      const newRandomStartIndex = checkValidStartIndex(
        randomStartIndex,
        ships[i].length,
        shipPlacements
      );
      const newShipPlacement = generateContinuousArray(
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
    <main className="container-fluid text-white relative">
      <Toaster />

      <div className="relative fixed top-0 flex justify-between items-center w-full">
        <img
          className="absolute w-full top-0 h-full -z-[1]"
          src={GameHeader}
          alt=""
        />
        {startGame ? (
          <div className="flex items-center gap-5">
            <img
              width={60}
              className={`ml-2 mt-2 ${
                !playerReady ? "transition-all scale-75 opacity-40" : ""
              }`}
              src={PlayerFace}
              alt=""
            />
            {playerReady ? (
              <span className="funky-font text-xl mt-2">
                {currentScore?.player}
              </span>
            ) : null}
          </div>
        ) : (
          <img width={60} src={PlayerFace} className="ml-2 mt-2" />
        )}
        <button
          onClick={() => setShowExitModal(true)}
          className="text-sm p-1 rounded-md mb-4 mr-2"
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
            <button
              onClick={() => handleAssignRandom(PlayerShips)}
              className="save-order p-2 rounded-md text-xs font-medium"
            >
              Assign Random
            </button>
            <button
              onClick={() => handlePlayerReadyScenario()}
              className="save-order p-2 rounded-md text-xs font-medium"
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
        <div className="grid grid-cols-1 xl:grid-cols-2 mt-1 pl-1.5 pr-1.5">
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
            />
          ) : null}

          {botShipsPlacement ? (
            <h1 className="text-white opacity-30 flex justify-center items-center h-[200px] text-xl animate-pulse">
              Bot is placing their trucks
            </h1>
          ) : null}
          {/* <progress value={40}></progress> */}
        </div>
      </DndContext>

      <div className="fixed bottom-0 w-full">
        <div className="relative w-full">
          <img
            className="absolute top-0 object-cover object-top -z-[1] h-full w-full"
            src={GameFooter}
            alt=""
          />
          <div className="flex justify-end items-center gap-5 h-full">
            {opponentReady ? (
              <span className="funky-font text-xl">{currentScore?.bot}</span>
            ) : null}
            <img
              className={`${
                !opponentReady ? "transition-all scale-75 opacity-40" : ""
              }`}
              src={BotFace}
              alt=""
              width={80}
            />
          </div>
        </div>
      </div>
      {showExitModal ? (
        <div
          className="h-screen bg-black absolute w-full top-0 z-[99999] grid
      place-items-center text-white"
        >
          <div className="flex flex-col gap-5 items-center">
            <h1 className="funky-font text-xl">
              Are you sure you want to quit?
            </h1>
            <div className="flex gap-5">
              <button
                className="text-xl funky-font"
                onClick={() => handleExit()}
              >
                Yes
              </button>
              <button
                className="text-xl funky-font"
                onClick={() => setShowExitModal(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

export default SinglePlayer;
