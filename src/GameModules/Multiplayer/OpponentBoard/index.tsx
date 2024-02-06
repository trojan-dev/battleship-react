import { useEffect, useState } from "preact/hooks";
import toast from "react-hot-toast";
import Flame from "../../../assets/Flame/Flame";
import "./style.css";
const SHIPS = [
  {
    shipType: "BATTLESHIP",
    length: 5,
    color: "red-600",
  },
  {
    shipType: "CARRIER",
    length: 4,
    color: "blue-600",
  },
  {
    shipType: "CRUISER",
    length: 3,
    color: "white-600",
  },
  {
    shipType: "DESTROYER",
    length: 3,
    color: "yellow-600",
  },
  {
    shipType: "SUBMARINE",
    length: 2,
    color: "green-600",
  },
];

function OpponentBoard(props: any) {
  const [shipCoordinatesArr, setShipCoordinates] = useState<any>({});
  const [sankShips, setSankShips] = useState<any>([]);
  const [currentHitShip, setCurrentHitShip] = useState<any>(null);
  const [cellStatus, setCellStatus] = useState<any>(
    [...Array(100).keys()].map(() => false)
  );

  function fireMissle(cell: number) {
    setCellStatus((prev: any) => ({ ...prev, [cell]: true }));
    props.socket.emit("fire-missile", cell);
    for (let ship in props.opponentPlacedShips) {
      if (props.opponentPlacedShips[ship].includes(cell)) {
        if (
          props.opponentPlacedShips[ship].length ===
          SHIPS[SHIPS.findIndex((el) => el.shipType === ship)].length
        ) {
          toast.success(`You hit ${ship}`);
          setCurrentHitShip(ship);
        }
        const newOpponentShipsPlacement = { ...props.opponentPlacedShips };
        const newArr = newOpponentShipsPlacement[ship].filter(
          (el: any) => el !== cell
        );
        props.setOpponentPlacedShips((prev: any) => ({
          ...prev,
          [ship]: newArr,
        }));
        props.socket.emit("opponent-ship-hit", newOpponentShipsPlacement);
      }
    }
  }

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
      window.location.reload();
    }
  }, [sankShips]);

  return (
    <div className="relative h-full flex flex-col">
      <div
        className={`grid gap-1 board grid-cols-[repeat(10,35px)] auto-rows-[35px] max-w-fit relative`}
      >
        {[...Array(100).keys()].map((block: number | any) => (
          <div
            onClick={() => fireMissle(block)}
            className={`bg-[#988646] rounded-sm p-1 flex justify-center items-center ${
              !props.startGame
                ? "pointer-events-none opacity-60"
                : "pointer-events-auto"
            }`}
          >
            {cellStatus[block] && !props.opponentCoordinates.includes(block) ? (
              <span className="text-2xl text-black font-extrabold">X</span>
            ) : cellStatus[block] &&
              props.opponentCoordinates.includes(block) ? (
              <>
                {/* <div className="p-2 rounded-full bg-white absolute missile-drop"></div> */}
                <Flame />
              </>
            ) : (
              ""
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default OpponentBoard;
