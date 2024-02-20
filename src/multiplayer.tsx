import { useState, useEffect } from "preact/hooks";
import { Toaster, toast } from "react-hot-toast";
import { DndContext, rectIntersection } from "@dnd-kit/core";
import { io } from "socket.io-client";
import PlayerBoard from "./GameModules/PlayerCommandCenter";
import OpponentBoard from "./GameModules/Multiplayer/OpponentBoard";

const TOTAL_COORDINATES = 17;
const BASE_CELL_SIZE = 30;
const DUMMY_ROOM_ID = "65969992a6e67c6d75cf938b";

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
  const [playerShipsOrientation, setPlayerShipsOrientation] = useState<any>({
    BATTLESHIP: "H",
    CARRIER: "H",
    CRUISER: "H",
    DESTROYER: "H",
    SUBMARINE: "H",
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
  const [playerTurn, setPlayerTurn] = useState(true);
  const [opponentTurn, setOpponentTurn] = useState(false);
  const [score, setScore] = useState({
    player: 0,
    opponent: 0,
  });

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
      const { coordinates, shipsPlacement, turn } = message;
      setOpponentPlacedShips(shipsPlacement);
      setOpponentCoordinates(coordinates);
      setOpponentReady(true);
      setPlayerReady(turn);
    });

    socket.on("player_chance", (message) => {
      setPlayerTurn(message);
      setOpponentTurn(!message);
    });

    socket.on("send-cell-info", (message: any) => {
      const { cell, strike, opponentShips } = message;
      // Update player's board situation after opponent hit
      setPlayerCellStatus((prev) => ({ ...prev, [cell]: strike }));
      setPlayerShipsCoordinates(opponentShips);
      setPlayerTurn(true);
      setOpponentTurn(false);
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
    function checkWhichShipGotSunk() {
      if (startGame) {
        for (let ship in playerShipsCoordinates) {
          if (!playerShipsCoordinates[ship].length) {
            toast.error(`Your ${ship} got sunk`);
            return true;
          }
        }
      }
    }
    checkWhichShipGotSunk();
  }, [playerShipsCoordinates]);

  useEffect(() => {
    if (startGame && !Object.values(playerShipsCoordinates).flat().length) {
      toast.error(`You lost!`);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  }, [playerShipsCoordinates]);

  // Check the actual position of the ship wrt to the board
  const calculateCellDistance = (start: any, shipType: string) => {
    let topDistance, leftDistance;
    if (playerShipsOrientation[shipType] === "H") {
      topDistance = `${Math.floor(start / 10) * BASE_CELL_SIZE - 5}px`;
      leftDistance =
        start % 10 === 0 ? `3px` : `${(start % 10) * BASE_CELL_SIZE + 2}px`;
      return { topDistance, leftDistance };
    }
    topDistance = `${Math.floor(start / 10) * BASE_CELL_SIZE}px`;
    leftDistance =
      start % 10 === 0 ? `0px` : `${(start % 10) * BASE_CELL_SIZE + 2}px`;
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
      let sortedCollisions = collisions.sort((a: any, b: any) => a.id - b.id);

      /* In case the user is trying to drag outside the boundaries */
      if (sortedCollisions.length < active.data.current.length) {
        return false;
      }

      if (
        sortedCollisions.length > active.data.current.length &&
        playerShipsOrientation[active.id] === "H"
      ) {
        let differenceInShipLengthAndCollisions =
          sortedCollisions.length - active.data.current.length;

        sortedCollisions.splice(0, differenceInShipLengthAndCollisions);
      }

      if (
        sortedCollisions.length > active.data.current.length &&
        playerShipsOrientation[active.id] === "V"
      ) {
        let differenceInShipLengthAndCollisions =
          sortedCollisions.length - active.data.current.length;
        sortedCollisions.splice(0, differenceInShipLengthAndCollisions);
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
        let coordinates = calculateCellDistance(shipStartIndex, active.id);
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
    </DndContext>
  );
}

export default Multiplayer;
