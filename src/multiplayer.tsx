import { useState, useEffect } from "preact/hooks";
import { Toaster, toast } from "react-hot-toast";
import { DndContext, rectIntersection } from "@dnd-kit/core";
import PlayerBoard from "./GameModules/Multiplayer/PlayerCommandCenter";
import OpponentBoard from "./GameModules/Singleplayer/OpponentBoard";

function Multiplayer() {
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

  function checkIfPlayerShipSank(ship: any) {
    if (!playerShipsCoordinates[ship].length) {
      alert(`Opponent sank your ${ship}`);
    }
  }

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
      setTimeout(() => {
        const playerCoordinates = { ...playerShipsCoordinates };
        if (!playerReady && opponentReady) {
          setCellStatus((prev) => ({ ...prev, [cell]: true }));
          if (placedCoordinates.includes(cell)) {
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
          }
          setOpponentReady(false);
          setPlayerReady(true);
        }
      }, 1200);
    }
    computerFiresMissle(Math.floor(Math.random() * (99 - 0 + 1) + 0));
  }, [playerReady, opponentReady]);

  const calculateCellDistance = (start: any, ship: any) => {
    let topDistance, leftDistance;
    if (shipsOreintation[ship] === "horizontal") {
      topDistance = `${Math.floor(start / 10) * 43 + 5}px`;
      leftDistance = start % 10 === 0 ? `5px` : `${(start % 10) * 43 + 5}px`;
      return { topDistance, leftDistance };
    }
    topDistance = `${Math.floor(start / 10) * 43 + 5}px`;
    leftDistance = start % 10 === 0 ? `5px` : `${(start % 10) * 43 + 5}px`;
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
    if (collisions) {
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
  };

  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragEnd={handleShipDrop}
    >
      <main className="container-fluid text-white p-3">
        <Toaster />
        <section className="container mx-auto">
          <div className="flex flex-col md:flex-row my-3 gap-10">
            <div>
              <h1 className="text-4xl ">Deploy your ships</h1>
              <h2 className="text-white opacity-60">
                drag to move and tap the rotate button to rotate.
              </h2>

              {!startGame ? (
                <button
                  className="border basis-3/12 p-2 rounded-md my-3"
                  disabled={!playerReady}
                  onClick={() => setStartGame(true)}
                >
                  Start Game
                </button>
              ) : null}
            </div>
            <div className="bg-transparent border p-1 rounded-lg grow">
              <h1 className="text-2xl mb-5 text-center">Gameplay Stats</h1>
              <div className="grid grid-cols-2 items-center">
                <div className="p-2 text-sm flex flex-col gap-1">
                  <h2 className="text-3xl">You</h2>
                  <div className="flex gap-2">
                    <h3>CARRIER</h3>
                    <progress max={100} value={60} />
                  </div>
                  <div className="flex gap-2">
                    <h3>BATTLESHIP</h3>
                    <progress max={100} value={60} />
                  </div>
                  <div className="flex gap-2">
                    <h3>CRUISER</h3>
                    <progress max={100} value={60} />
                  </div>
                  <div className="flex gap-2">
                    <h3>DESTROYER</h3>
                    <progress max={100} value={60} />
                  </div>
                  <div className="flex gap-2">
                    <h3>SUBMARINE</h3>
                    <progress max={100} value={60} />
                  </div>
                </div>
                <div className="p-2 text-sm text-center">
                  <h2>Opponent</h2>
                  <h3>BATTLESHIP</h3>
                  <h3>CARRIER</h3>
                  <h3>CRUISER</h3>
                  <h3>DESTROYER</h3>
                  <h3>SUBMARINE</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-5 grid-cols-1 lg:grid-cols-2">
            <PlayerBoard
              placedShips={placedCoordinates}
              playerShipsCoordinates={playerShipsCoordinates}
              setShipOrientation={setShipOrientation}
              cellStatus={cellStatus}
              setPlayerReady={setPlayerReady}
              setOpponentReady={setOpponentReady}
            />

            {/* <OpponentBoard
              startGame={startGame}
              setPlayerReady={setPlayerReady}
              setOpponentReady={setOpponentReady}
              playerReady={playerReady}
              opponentReady={opponentReady}
            /> */}
          </div>
        </section>
      </main>
    </DndContext>
  );
}

export default Multiplayer;
