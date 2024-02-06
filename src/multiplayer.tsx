import { useState, useEffect } from "preact/hooks";
import { Toaster, toast } from "react-hot-toast";
import { DndContext, rectIntersection } from "@dnd-kit/core";
import { io } from "socket.io-client";
import PlayerBoard from "./GameModules/Multiplayer/PlayerCommandCenter";
import OpponentBoard from "./GameModules/Multiplayer/OpponentBoard";

function Multiplayer() {
  const [playerReady, setPlayerReady] = useState(false);
  const [playerShipsCoordinates, setPlayerShipsCoordinates] = useState<any>({
    BATTLESHIP: [],
    CARRIER: [],
    CRUISER: [],
    DESTROYER: [],
    SUBMARINE: [],
  });
  const [shipsHealth] = useState<any>({
    BATTLESHIP: 100,
    CARRIER: 100,
    CRUISER: 100,
    DESTROYER: 100,
    SUBMARINE: 100,
  });
  const [placedCoordinates, setPlacedCoordinates] = useState<Array<number>>([]);
  const [cellStatus, setCellStatus] = useState(
    [...Array(100).keys()].map(() => false)
  );
  const [userSocketInstance, setUserSocketInstance] = useState<any>(null);

  const [opponentReady, setOpponentReady] = useState(false);
  const [opponentPlacedShips, setOpponentPlacedShips] = useState(null);
  const [opponentCoordinates, setOpponentCoordinates] = useState([]);
  const [opponentName, setOpponentName] = useState("");

  const [startGame, setStartGame] = useState(false);

  const [playerTurn, setPlayerTurn] = useState(true);
  const [opponentTurn, setOpponentTurn] = useState(false);

  useEffect(() => {
    const socket = io(`https://battleship-server-socket.onrender.com`);
    socket.on("connect", () => {
      setUserSocketInstance(socket);
      toast.success(
        `You have connected to the server with socket ${socket.id}`,
        {
          duration: 2000,
        }
      );
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    if (userSocketInstance) {
      userSocketInstance.on("receive-opponent-status", (message: any) => {
        const { playerName, coordinates, shipsPlacement } = message;
        setOpponentName(playerName);
        setOpponentPlacedShips(shipsPlacement);
        setOpponentCoordinates(coordinates);
        setOpponentReady(true);
      });
      userSocketInstance.on("send-cell-info", (message: any) => {
        setCellStatus((prev) => ({ ...prev, [message]: true }));
      });
    }
  }, [userSocketInstance]);

  useEffect(() => {
    if (playerReady && opponentReady) {
      setStartGame(true);
    }
  }, [playerReady, opponentReady]);

  const calculateCellDistance = (start: any) => {
    let topDistance, leftDistance;
    // if (shipsOreintation[ship] === "horizontal") {
    topDistance = `${Math.floor(start / 10) * 39 + 6}px`;
    leftDistance = start % 10 === 0 ? `6px` : `${(start % 10) * 39 + 4}px`;
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
                    onClick={() => {
                      if (placedCoordinates.length === 17) {
                        userSocketInstance.emit(
                          "player-ready",
                          JSON.stringify(
                            localStorage.getItem("battleship-player")
                          ),
                          playerShipsCoordinates,
                          placedCoordinates,
                          userSocketInstance.id
                        );
                        setPlayerReady(true);
                      } else {
                        toast.error(`Please place all your ships first!`);
                      }
                    }}
                  >
                    Confirm
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          <div className="grid gap-5 grid-cols-1 lg:grid-cols-2">
            <div>
              <h1>{localStorage.getItem("battleship-player")}</h1>
              <PlayerBoard
                placedShips={placedCoordinates}
                playerShipsCoordinates={playerShipsCoordinates}
                cellStatus={cellStatus}
                shipsHealth={shipsHealth}
                startGame={startGame}
                playerReady={playerReady}
                opponentReady={opponentReady}
              />
            </div>

            <div>
              <h1>{opponentName}</h1>
              <OpponentBoard
                startGame={startGame}
                // setPlayerReady={setPlayerReady}
                // setOpponentReady={setOpponentReady}
                playerReady={playerReady}
                opponentReady={opponentReady}
                opponentPlacedShips={opponentPlacedShips}
                opponentCoordinates={opponentCoordinates}
                socket={userSocketInstance}
                playerTurn={playerTurn}
                opponentTurn={opponentTurn}
              />
            </div>
          </div>
        </section>
      </main>
    </DndContext>
  );
}

export default Multiplayer;
