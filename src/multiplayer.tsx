import { useState, useEffect } from "preact/hooks";
import { Toaster, toast } from "react-hot-toast";
import { DndContext, rectIntersection } from "@dnd-kit/core";
import PlayerBoard from "./GameModules/Multiplayer/PlayerCommandCenter";
import OpponentBoard from "./GameModules/Multiplayer/OpponentBoard";

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
  const [shipsHealth, setShipsHealth] = useState<any>({
    BATTLESHIP: 100,
    CARRIER: 100,
    CRUISER: 100,
    DESTROYER: 100,
    SUBMARINE: 100,
  });
  const [placedCoordinates, setPlacedCoordinates] = useState<any>([]);
  const [cellStatus, setCellStatus] = useState(
    [...Array(100).keys()].map(() => false)
  );
  const [currentPlayerShipHit, setCurrentPlayerShipHit] = useState<any>({
    ship: null,
    length: null,
    firstHit: null,
    secondHit: null,
    possibleHits: [],
    trackedShip: [],
  });

  function checkIfPlayerShipSank(ship: any) {
    if (!playerShipsCoordinates[ship].length) {
      setCurrentPlayerShipHit({ ship: null, hit: [] });
      toast.success(`Opponent sank your ${ship}`);
    }
  }

  useEffect(() => {
    function checkIfPlayerIsReady() {
      if (placedCoordinates.length === 17) {
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
                setShipsHealth((prev: any) => ({
                  ...prev,
                  [ship]: prev[ship] - 25,
                }));
                if (!currentPlayerShipHit.firstHit) {
                  setCurrentPlayerShipHit((prev: any) => ({
                    ...prev,
                    ship: ship,
                    firstHit: cell,
                  }));
                }
                if (
                  !currentPlayerShipHit.secondHit &&
                  currentPlayerShipHit.firstHit
                ) {
                  setCurrentPlayerShipHit((prev: any) => ({
                    ...prev,
                    ship: ship,
                    secondHit: cell,
                  }));
                }
              }
            }
          }
          setOpponentReady(false);
          setPlayerReady(true);
        }
      }, 1200);
    }
    // if (
    //   currentPlayerShipHit.ship &&
    //   !currentPlayerShipHit.possibleHits.length
    // ) {
    //    If there is already a ship hit, calculate the possible values from there...
    //   const hit = trackPossibleShipLocationsAndReturnARandomSlot();
    //   computerFiresMissle(hit);
    //   return;
    // }
    // if (
    //   currentPlayerShipHit.ship &&
    //   currentPlayerShipHit.possibleHits.length &&
    //   !currentPlayerShipHit.secondHit
    // ) {
    //   If there is already a ship hit and possible values are calculated
    //   const hit =
    //     currentPlayerShipHit.possibleHits[
    //       Math.floor(Math.random() * currentPlayerShipHit.possibleHits.length)
    //     ];
    //   setCurrentPlayerShipHit((prev: any) => ({
    //     ...prev,
    //     possibleHits: prev.possibleHits.filter((el: any) => el !== hit),
    //   }));
    //   computerFiresMissle(hit);
    //   return;
    // }

    // if (currentPlayerShipHit.secondHit) {
    //    Implement the diff logic
    // }
    computerFiresMissle(Math.floor(Math.random() * (99 - 0 + 1) + 0));
  }, [playerReady, opponentReady]);

  const calculateCellDistance = (start: any) => {
    let topDistance, leftDistance;
    // if (shipsOreintation[ship] === "horizontal") {
    topDistance = `${Math.floor(start / 10) * 40 + 2}px`;
    leftDistance = start % 10 === 0 ? `2px` : `${(start % 10) * 40 + 3}px`;
    return { topDistance, leftDistance };
    // }
    // topDistance = `${Math.floor(start / 10) * 40 + 3}px`;
    // leftDistance = start % 10 === 0 ? `5px` : `${(start % 10) * 40 + 3}px`;
    // return { topDistance, leftDistance };
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

  // const trackPossibleShipLocationsAndReturnARandomSlot = () => {
  //   let possibleMoves: Array<number> = [
  //     currentPlayerShipHit.firstHit + 1,
  //     currentPlayerShipHit.firstHit - 10,
  //     currentPlayerShipHit.firstHit + 10,
  //     currentPlayerShipHit.firstHit - 1,
  //   ];
  //   const validMoves = possibleMoves.filter((move) => move > 0 && move < 99);
  //   const randomValidMove =
  //     validMoves[Math.floor(Math.random() * validMoves.length)];
  //   setCurrentPlayerShipHit((prev: any) => ({
  //     ...prev,
  //     possibleHits: validMoves.filter((el) => el !== randomValidMove),
  //   }));
  //   return randomValidMove;
  // };

  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragEnd={handleShipDrop}
    >
      <main className="container-fluid text-white p-3">
        <Toaster />
        <section className="container mx-auto">
          <div className="flex flex-col md:flex-row my-5 gap-10">
            <div>
              <h1 className="text-4xl ">Deploy your ships</h1>
              <h2 className="text-white opacity-60">
                drag to move and tap the rotate button to rotate.
              </h2>

              {!startGame ? (
                <div className="flex my-2">
                  <button
                    className={`border basis-3/12 p-2 rounded-md ${
                      !playerReady ? "opacity-40" : "opacity-100"
                    }`}
                    disabled={!playerReady}
                    onClick={() => setStartGame(true)}
                  >
                    Play
                  </button>
                </div>
              ) : null}
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
              shipsHealth={shipsHealth}
              startGame={startGame}
              playerReady={playerReady}
              opponentReady={opponentReady}
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

export default Multiplayer;
