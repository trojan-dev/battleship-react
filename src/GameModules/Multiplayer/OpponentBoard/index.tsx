import { useEffect, useState } from "preact/hooks";
import toast from "react-hot-toast";
import BoardCell from "../../../assets/Cell";
import "./style.css";
import Bombed from "../../../assets/Bombed";
import CellMiss from "../../../assets/CellMiss";

function OpponentBoard(props: any) {
  const [opponentSunkShips, setOpponentSunkShips] = useState<any>([]);

  // Opponent's ship cell status
  const [opponentCellStatus, setOpponentCellStatus] = useState<any>(
    [...Array(100).keys()].map(() => "EMPTY")
  );

  const checkIfOpponentShipSank = (ship: string, opponentShips: any) => {
    if (!opponentShips[ship].length) {
      toast.success(`Opponent's ${ship} has been sunk. Bravo!`, {
        duration: 1500,
      });
      setOpponentSunkShips((prev: any) => [...prev, ship]);
    }
  };

  useEffect(() => {
    if (opponentSunkShips.length === 5) {
      toast.success(`You are victorious!`);
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    }
  }, [opponentSunkShips]);

  function checkWhichShipGotHit(currentCoordinates: any, cell: any): string {
    for (let ship in currentCoordinates) {
      if (currentCoordinates[ship].includes(cell)) {
        return ship;
      }
    }
    return "";
  }

  function fireMissle(cell: number) {
    const currentOpponentCoordinates = Object.values(
      props.opponentPlacedShips
    ).flat(1);
    if (currentOpponentCoordinates.includes(cell)) {
      // Find which ship got hit
      const hitShip = checkWhichShipGotHit(props.opponentPlacedShips, cell);
      // Update opponent's board status locally using state
      setOpponentCellStatus((prev: any) => ({ ...prev, [cell]: "HIT" }));
      // Convey the missile strike to opponent and send them updated ship placements
      const newOpponentShipsPlacement = { ...props.opponentPlacedShips };
      const newArr = newOpponentShipsPlacement[hitShip].filter(
        (el: any) => el !== cell
      );
      newOpponentShipsPlacement[hitShip] = newArr;
      props.setOpponentPlacedShips(newOpponentShipsPlacement);
      checkIfOpponentShipSank(hitShip, newOpponentShipsPlacement);
      toast.success(`Opponent's ${hitShip} has been hit. Good job!`, {
        duration: 1500,
      });
      props.socket.emit("fire-missile", cell, "HIT", newOpponentShipsPlacement);
    } else {
      setOpponentCellStatus((prev: any) => ({ ...prev, [cell]: "MISS" }));
      props.socket.emit(
        "fire-missile",
        cell,
        "MISS",
        props.opponentPlacedShips
      );
    }
    props.setPlayerTurn(false);
    props.setOpponentTurn(true);
  }

  return (
    <div className="relative h-full flex flex-col items-center justify-center">
      {/* {!props.opponentJoined ? (
        <p className="text-md animate-pulse">Waiting for Player 2 to join</p>
      ) : (
        <p className="text-md animate-pulse">
          Opponent is placing their ships.
        </p>
      )} */}

      {props.startGame ? (
        <div
          className={`grid board grid-cols-[repeat(10,30px)] relative ${
            props.opponentTurn
              ? "pointer-events-none opacity-40"
              : "pointer-events-auto opacity-100"
          }`}
        >
          {[...Array(100).keys()].map((block: number | any) => (
            <div
              onClick={() => fireMissle(block)}
              className="flex justify-center items-center"
            >
              {/* <BoardCell>
                {opponentCellStatus[block] === "EMPTY" ? "" : null}
                {opponentCellStatus[block] === "MISS" ? <CellMiss /> : null}
                {opponentCellStatus[block] === "HIT" ? <Bombed /> : null}
              </BoardCell> */}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-center animate-pulse mt-5">
          Waiting for player 2 to join and place their ships
        </p>
      )}
    </div>
  );
}

export default OpponentBoard;
