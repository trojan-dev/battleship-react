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
  const [allPlacedCoordinates, setAllPlacedCoordinates] = useState<any>([]);
  const [sankShips, setSankShips] = useState<any>([]);
  const [currentHitShip, setCurrentHitShip] = useState<any>(null);
  const [cellStatus, setCellStatus] = useState<any>(
    [...Array(100).keys()].map(() => false)
  );

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

  function fireMissle(cell: number) {
    setCellStatus((prev: any) => ({ ...prev, [cell]: true }));
    for (let ship in shipCoordinatesArr) {
      if (shipCoordinatesArr[ship].includes(cell)) {
        if (
          shipCoordinatesArr[ship].length ===
          SHIPS[SHIPS.findIndex((el) => el.shipType === ship)].length
        ) {
          // alert(`You hit opponent's ${ship}. Keep going!`);
          toast.success(`You hit ${ship}`);
          setCurrentHitShip(ship);
        }
        const newArr = shipCoordinatesArr[ship].filter(
          (el: any) => el !== cell
        );
        setShipCoordinates((prev: any) => ({ ...prev, [ship]: newArr }));
      }
    }
    props.setPlayerReady(false);
    props.setOpponentReady(true);
  }

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
      alert("you won!");
    }
  }, [sankShips]);

  return (
    <div className="relative h-full flex flex-col">
      <div
        className={`${
          !props.startGame
            ? "opacity-40 pointer-events-none"
            : "pointer-events-auto"
        } grid gap-1 board grid-cols-[repeat(10,35px)] auto-rows-[35px] max-w-fit relative`}
      >
        {[...Array(100).keys()].map((block: number | any) => (
          <div
            onClick={() => fireMissle(block)}
            className={`bg-[#988646] rounded-sm p-1 flex justify-center items-center ${
              props.opponentReady
                ? "pointer-events-none opacity-60"
                : "pointer-events-auto"
            }`}
          >
            {cellStatus[block] && !allPlacedCoordinates.includes(block) ? (
              <span className="text-2xl text-black font-extrabold">X</span>
            ) : cellStatus[block] && allPlacedCoordinates.includes(block) ? (
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
