import { useState, useEffect } from "preact/hooks";
import { DndContext, rectIntersection } from "@dnd-kit/core";
import PlayerBoard from "./GameModules/PlayerBoard";
import OpponentBoard from "./GameModules/OpponentBoard";

function App() {
  const [playerReady, setPlayerReady] = useState(false);
  const [opponentReady, setOpponentReady] = useState(false);
  const [startGame, setStartGame] = useState(false);
  const [isHorizontal] = useState<boolean>(true);
  const [playerShipsCoordinates, setPlayerShipsCoordinates] = useState<any>({
    BATTLESHIP: [],
    CARRIER: [],
    CRUISER: [],
    DESTROYER: [],
    SUBMARINE: [],
  });
  console.log(playerShipsCoordinates);
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
        setTimeout(() => {
          setCellStatus((prev) => ({ ...prev, [cell]: true }));
          setOpponentReady(false);
          setPlayerReady(true);
        }, 1200);
      }
    }
    computerFiresMissle(Math.floor(Math.random() * (99 - 0 + 1) + 0));
  }, [playerReady, opponentReady]);

  const calculateCellDistance = (start: any, isHorizontal: any) => {
    let topDistance, leftDistance;
    if (isHorizontal) {
      topDistance = `${Math.floor(start / 10) * 30 + 5}px`;
      leftDistance = start % 10 === 0 ? `2px` : `${(start % 10) * 30 + 2}px`;
      return { topDistance, leftDistance };
    }
    topDistance = `${Math.floor(start / 10) * 30 + 2}px`;
    leftDistance = start % 10 === 0 ? `5px` : `${(start % 10) * 30 + 5}px`;
    return { topDistance, leftDistance };
  };

  const handleShipDrop = (event: any) => {
    const { active, collisions } = event;
    console.log(event);

    const sortedCollisions = collisions.sort((a: any, b: any) => a.id - b.id);
    if (collisions.length === active.data.current.length + 1) {
      sortedCollisions.pop();
    }
    if (collisions.length < active.data.current.length) {
      return false;
    }
    const draggedElement = document.getElementById(active.id);
    let shipStartIndex, shipEndIndex;
    if (draggedElement) {
      shipStartIndex = sortedCollisions[0].id;
      shipEndIndex = sortedCollisions[sortedCollisions.length - 1].id;

      if (
        placedCoordinates.includes(shipStartIndex) ||
        placedCoordinates.includes(shipEndIndex)
      ) {
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
      let coordinates = calculateCellDistance(shipStartIndex, isHorizontal);
      if (coordinates) {
        if (isHorizontal) {
          draggedElement.style.top = coordinates.topDistance;
          draggedElement.style.left = coordinates.leftDistance;
        } else {
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
      <main className="container-fluid bg-black text-white p-3">
        <section className="container mx-auto">
          <h1 className="text-4xl text-center my-3">Sea Battle</h1>
          {!startGame ? (
            <div className="flex justify-center my-2">
              <button
                className="border p-2 rounded-md"
                disabled={!playerReady}
                onClick={() => setStartGame(true)}
              >
                Play
              </button>
            </div>
          ) : null}
          <div className="grid gap-1 grid-cols-1">
            <PlayerBoard
              placedShips={placedCoordinates}
              isHorizontal={isHorizontal}
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
        </section>
      </main>
    </DndContext>
  );
}

export default App;
