import { useState, useEffect } from "preact/hooks";
import { Toaster, toast } from "react-hot-toast";
import { DndContext, rectIntersection } from "@dnd-kit/core";
import { io } from "socket.io-client";
import PlayerBoard from "./GameModules/Multiplayer/PlayerCommandCenter";
import OpponentBoard from "./GameModules/Multiplayer/OpponentBoard";

const TOTAL_COORDINATES = 16;

function Multiplayer() {
  const [userSocketInstance, setUserSocketInstance] = useState<any>(null);

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
  const [playerCellStatus, setPlayerCellStatus] = useState(
    [...Array(100).keys()].map(() => "EMPTY")
  );

  /* Current opponent info */
  const [opponentReady, setOpponentReady] = useState(false);
  const [opponentPlacedShips, setOpponentPlacedShips] = useState<any>({});
  const [opponentCoordinates, setOpponentCoordinates] = useState([]);

  /* Start game */
  const [startGame, setStartGame] = useState(false);

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

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (userSocketInstance) {
      userSocketInstance.on("receive-opponent-status", (message: any) => {
        const { coordinates, shipsPlacement } = message;
        setOpponentPlacedShips(shipsPlacement);
        setOpponentCoordinates(coordinates);
        setOpponentReady(true);
      });
      userSocketInstance.on("send-cell-info", (message: any) => {
        const { cell, strike, opponentShips } = message;
        // Update player's board situation after opponent hit
        setPlayerCellStatus((prev) => ({ ...prev, [cell]: strike }));
        setPlayerShipsCoordinates(opponentShips);
      });
    }
  }, [userSocketInstance]);

  useEffect(() => {
    if (playerReady && opponentReady) {
      setStartGame(true);
    }
  }, [playerReady, opponentReady]);

  useEffect(() => {
    if (startGame && !Object.values(playerShipsCoordinates).flat().length) {
      toast.error(`You lost!`);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  }, [playerShipsCoordinates]);

  // Check the actual position of the ship wrt to the board
  const calculateCellDistance = (start: any) => {
    let topDistance, leftDistance;
    topDistance = `${Math.floor(start / 10) * 45 + 2}px`;
    leftDistance = start % 10 === 0 ? `5px` : `${(start % 10) * 45 + 5}px`;
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

  // Run this when the ship is dragged on the board by the player
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

        console.log(sortedCollisions);
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
      userSocketInstance.emit(
        "player-ready",
        playerShipsCoordinates,
        placedCoordinates
      );
      setPlayerReady(true);
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

          <div className="grid gap-5 grid-cols-1 lg:grid-cols-2">
            <div>
              <PlayerBoard
                placedShips={placedCoordinates}
                playerShipsCoordinates={playerShipsCoordinates}
                cellStatus={playerCellStatus}
                startGame={startGame}
                playerReady={playerReady}
                opponentReady={opponentReady}
              />
            </div>

            <div>
              <OpponentBoard
                socket={userSocketInstance}
                startGame={startGame}
                playerReady={playerReady}
                opponentReady={opponentReady}
                opponentPlacedShips={opponentPlacedShips}
                opponentCoordinates={opponentCoordinates}
                setOpponentPlacedShips={setOpponentPlacedShips}
              />
            </div>
          </div>
        </section>
      </main>
    </DndContext>
  );
}

export default Multiplayer;
