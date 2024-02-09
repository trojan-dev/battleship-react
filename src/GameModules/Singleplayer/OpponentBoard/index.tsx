import { useEffect, useState } from "preact/hooks";
import toast from "react-hot-toast";
import "./style.css";
import Bombed from "../../../assets/Bombed";
import BoardCell from "../../../assets/Cell";
import CellMiss from "../../../assets/CellMiss";

function OpponentBoard(props: any) {
  const [shipCoordinatesArr, setShipCoordinates] = useState<any>({});
  const [allPlacedCoordinates, setAllPlacedCoordinates] = useState<any>([]);
  const [sankShips, setSankShips] = useState<any>([]);
  const [currentHitShip, setCurrentHitShip] = useState<any>(null);
  // Opponent's ship cell status
  const [opponentCellStatus, setOpponentCellStatus] = useState<any>(
    [...Array(100).keys()].map(() => "EMPTY")
  );

  useEffect(() => {
    generateOpponentShips();
  }, []);

  useEffect(() => {
    if (currentHitShip) {
      if (!shipCoordinatesArr[currentHitShip].length) {
        toast.success(`You sank opponent's ${currentHitShip}`);
        const newShipCoordinates = { ...shipCoordinatesArr };
        delete newShipCoordinates[currentHitShip];
        setShipCoordinates(newShipCoordinates);
        setSankShips((prev: any) => [...prev, currentHitShip]);
        setCurrentHitShip(null);
      }
    }
  }, [shipCoordinatesArr]);

  useEffect(() => {
    if (sankShips.length === 5) {
      toast.success("You won!");
    }
  }, [sankShips]);

  function generateOpponentShips() {
    const placement: any = {
      BATTLESHIP: [0, 1, 2, 3, 4],
      CARRIER: [31, 32, 33, 34],
      CRUISER: [25, 26, 27],
      DESTROYER: [55, 65, 75],
      SUBMARINE: [98, 99],
    };
    setShipCoordinates(placement);
    setAllPlacedCoordinates(Object.values(placement).flat(Infinity));
  }

  function checkWhichShipGotHit(currentCoordinates: any, cell: any): string {
    for (let ship in currentCoordinates) {
      if (currentCoordinates[ship].includes(cell)) {
        return ship;
      }
    }
    return "";
  }

  function fireMissle(cell: number) {
    if (allPlacedCoordinates.includes(cell)) {
      setOpponentCellStatus((prev: any) => ({ ...prev, [cell]: "HIT" }));
      const hitShip = checkWhichShipGotHit(shipCoordinatesArr, cell);
      toast.success(`You hit ${hitShip}`);
      setCurrentHitShip(hitShip);
      const newArr = shipCoordinatesArr[hitShip].filter(
        (el: any) => el !== cell
      );
      setShipCoordinates((prev: any) => ({ ...prev, [hitShip]: newArr }));
    } else {
      setOpponentCellStatus((prev: any) => ({ ...prev, [cell]: "MISS" }));
    }
    props.setPlayerReady(false);
    props.setOpponentReady(true);
  }

  return (
    <div className="relative h-full flex flex-col">
      <div
        className={`${
          !props.startGame ? "pointer-events-none" : "pointer-events-auto"
        } grid gap-0.5 board grid-cols-[repeat(10,40px)] auto-rows-[40px] relative`}
      >
        {[...Array(100).keys()].map((block: number | any) => (
          <div
            onClick={() => fireMissle(block)}
            className={`flex justify-center items-center ${
              props.playerReady ? "pointer-events-auto" : "pointer-events-none"
            }`}
          >
            <BoardCell>
              {opponentCellStatus[block] === "EMPTY" ? "" : null}
              {opponentCellStatus[block] === "MISS" ? <CellMiss /> : null}
              {opponentCellStatus[block] === "HIT" ? <Bombed /> : null}
            </BoardCell>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OpponentBoard;
