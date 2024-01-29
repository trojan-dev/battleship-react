import { useState, useEffect } from "preact/hooks";
import { DndContext, rectIntersection } from "@dnd-kit/core";
import PlayerBoard from "./GameModules/PlayerBoard";
import OpponentBoard from "./GameModules/OpponentBoard";

function App() {
  const [playerReady, setPlayerReady] = useState(false);
  const [opponentReady, setOpponentReady] = useState(false);
  const [startGame, setStartGame] = useState(false);
  const [playerShipsCoordinates, setPlayerShipsCoordinates] = useState<any>({
    BATTLESHIP: [],
    CARRIER: [],
    CRUISER: [],
    DESTROYER: [],
    SUBMARINE: [],
  });
  console.log(playerShipsCoordinates);
  const [shipsOreintation, setShipOrientation] = useState<any>({
    BATTLESHIP: "horizontal",
    CARRIER: "horizontal",
    CRUISER: "horizontal",
    DESTROYER: "horizontal",
    SUBMARINE: "horizontal",
  });
  const [placedCoordinates, setPlacedCoordinates] = useState<any>([]);
  const [cellStatus, setCellStatus] = useState(
    [...Array(100).keys()].map((cell) => false)
  );

  useEffect(() => {
    function checkIfPlayerIsReady() {
      if (placedCoordinates.length >= 16) {
        setPlayerReady(true);
      }
    }
    checkIfPlayerIsReady();
  }, [placedCoordinates]);

  useEffect(() => {
    function computerFiresMissle(cell: number) {
      if (!playerReady && opponentReady) {
        setCellStatus((prev) => ({ ...prev, [cell]: true }));
        setOpponentReady(false);
        setPlayerReady(true);
      }
    }
    computerFiresMissle(Math.floor(Math.random() * (99 - 0 + 1) + 0));
  }, [playerReady, opponentReady]);

  const calculateCellDistance = (start: any, ship: any) => {
    let topDistance, leftDistance;
    if (shipsOreintation[ship] === "horizontal") {
      topDistance = `${Math.floor(start / 10) * 30 + 5}px`;
      leftDistance = start % 10 === 0 ? `5px` : `${(start % 10) * 30 + 5}px`;
      return { topDistance, leftDistance };
    }
    topDistance = `${Math.floor(start / 10) * 30 + 5}px`;
    leftDistance = start % 10 === 0 ? `5px` : `${(start % 10) * 30 + 5}px`;
    return { topDistance, leftDistance };
  };

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
    const sortedCollisions = collisions.sort((a: any, b: any) => a.id - b.id);
    if (collisions.length === active.data.current.length + 1) {
      sortedCollisions.pop();
    }
    if (
      collisions.length < active.data.current.length ||
      collisions.length > active.data.current.length
    ) {
      return false;
    }

    const draggedElement = document.getElementById(active.id);
    let shipStartIndex, shipEndIndex, ifCollision;
    if (draggedElement) {
      shipStartIndex = sortedCollisions[0].id;
      shipEndIndex = sortedCollisions[sortedCollisions.length - 1].id;
      ifCollision = checkIfShipCollision(sortedCollisions, active.id);
      if (ifCollision) {
        alert("122");
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
  };

  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragEnd={handleShipDrop}
    >
      <main className="container-fluid bg-black text-white p-3">
        <section className="container mx-auto">
          <h1 className="text-4xl text-center my-5">Sea Battle</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 items-start">
            <PlayerBoard
              placedShips={placedCoordinates}
              playerShipsCoordinates={playerShipsCoordinates}
              setShipOrientation={setShipOrientation}
              cellStatus={cellStatus}
              setPlayerReady={setPlayerReady}
              setOpponentReady={setOpponentReady}
            />

            <OpponentBoard
              startGame={startGame}
              setPlayerReady={setPlayerReady}
              setOpponentReady={setOpponentReady}
              playerReady={playerReady}
              opponentReady={opponentReady}
            />
          </div>
          {!startGame ? (
            <div className="flex justify-center my-2">
              <button
                className="border basis-3/12 p-2 rounded-md"
                disabled={!playerReady}
                onClick={() => setStartGame(true)}
              >
                Play
              </button>
            </div>
          ) : null}
        </section>
      </main>
    </DndContext>
  );
}

export default App;
