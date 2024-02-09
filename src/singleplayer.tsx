import { useState, useEffect } from "preact/hooks";
import { Toaster, toast } from "react-hot-toast";
import { DndContext, rectIntersection } from "@dnd-kit/core";
import PlayerBoard from "./GameModules/Singleplayer/PlayerCommandCenter";
import OpponentBoard from "./GameModules/Singleplayer/OpponentBoard";

const TOTAL_COORDINATES = 16;

function SinglePlayer() {
  /* Current player info */
  const [playerReady, setPlayerReady] = useState(false);
  const [playerShipsCoordinates, setPlayerShipsCoordinates] = useState<any>({
    BATTLESHIP: [],
    CARRIER: [],
    CRUISER: [],
    DESTROYER: [],
    SUBMARINE: [],
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

  function checkIfPlayerShipSank(ship: any) {
    if (!playerShipsCoordinates[ship].length) {
      toast.success(`Opponent sank your ${ship}`);
    }
  }

  useEffect(() => {
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
          setOpponentReady(false);
          setPlayerReady(true);
        }
      }, 1000);
    }
    computerFiresMissle(Math.floor(Math.random() * (99 - 0 + 1) + 0));
  }, [playerReady]);

  // Check the actual position of the ship wrt to the board
  const calculateCellDistance = (start: any) => {
    let topDistance, leftDistance;
    topDistance = `${Math.floor(start / 10) * 42 - 16}px`;
    leftDistance = start % 10 === 0 ? `2px` : `${(start % 10) * 42 - 6}px`;
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
    const { active, collisions } = event;
    if (collisions) {
      const sortedCollisions = collisions.sort((a: any, b: any) => a.id - b.id);
      if (sortedCollisions.length === active.data.current.length + 1) {
        sortedCollisions.pop();
      }
      if (sortedCollisions.length < active.data.current.length) {
        return false;
      }

      if (sortedCollisions.length > active.data.current.length) {
        let differenceInShipLengthAndCollisions =
          sortedCollisions.length - active.data.current.length;
        sortedCollisions.splice(
          active.data.current.length,
          differenceInShipLengthAndCollisions
        );
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
        let coordinates = calculateCellDistance(shipStartIndex);
        if (coordinates) {
          draggedElement.style.top = coordinates.topDistance;
          draggedElement.style.left = coordinates.leftDistance;
        }
      }
    }
  };

  // Run this after player has confirmed their ships
  const handlePlayerReadyScenario = () => {
    if (
      Object.values(playerShipsCoordinates).flat(1).length === TOTAL_COORDINATES
    ) {
      setPlayerReady(true);
      setStartGame(true);
    } else {
      toast.error(`Please place all your ships first!`);
    }
  };

  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragEnd={handleShipDrop}
    >
      <main className="container-fluid text-white p-3">
        <Toaster />
        <section className="container mx-auto">
          <div className="flex flex-col items-center my-5 gap-2">
            <h1 className="text-4xl ">Deploy your ships</h1>
            <h2 className="text-white opacity-60">
              drag to move and tap the rotate button to rotate.
            </h2>

            <div className="flex justify-center w-[50%] gap-2 my-2">
              {!startGame ? (
                <button
                  className={`border basis-3/12 p-2 rounded-md w-full`}
                  onClick={() => handlePlayerReadyScenario()}
                >
                  Play
                </button>
              ) : null}
            </div>
          </div>

          <div className="grid items-center gap-5 grid-cols-1 lg:grid-cols-2">
            <PlayerBoard
              placedShips={placedCoordinates}
              playerShipsCoordinates={playerShipsCoordinates}
              playerCellStatus={playerCellStatus}
              startGame={startGame}
              playerReady={playerReady}
              opponentReady={opponentReady}
              setPlayerReady={setPlayerReady}
              setOpponentReady={setOpponentReady}
            />

            <OpponentBoard
              startGame={startGame}
              playerReady={playerReady}
              opponentReady={opponentReady}
              setPlayerReady={setPlayerReady}
              setOpponentReady={setOpponentReady}
            />
          </div>
        </section>
      </main>
    </DndContext>
  );
}

export default SinglePlayer;
