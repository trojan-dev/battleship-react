import { useEffect, useState } from "preact/hooks";
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
// const opponentShipMap = new Map();
// function generateRandomNumberExcludingSome(exclude: any, length: any) {
//   const nums = [];
//   for (let i = 0; i <= 99; i++) {
//     if (
//       !exclude.includes(i) &&
//       i % 10 < length &&
//       !exclude.includes(i + 1 * length - 1)
//     )
//       nums.push(i);
//   }
//   if (nums.length === 0) return false;
//   const randomIndex = Math.floor(Math.random() * nums.length);
//   return nums[randomIndex];
// }

function OpponentBoard(props: any) {
  const [shipCoordinatesArr, setShipCoordinates] = useState<any>({});
  const [allPlacedCoordinates, setAllPlacedCoordinates] = useState<any>([]);
  const [sankShips, setSankShips] = useState<any>([]);
  const [currentHitShip, setCurrentHitShip] = useState<any>(null);
  const [cellStatus, setCellStatus] = useState<any>(
    [...Array(100).keys()].map((cell) => false)
  );

  function generateOpponentShips() {
    // let shipCoordinates: any = [];
    // let startIndex;
    // SHIPS.forEach((ship) => opponentShipMap.set(ship.shipType, []));
    // SHIPS.forEach((ship) => {
    //   const isHorizontal = Math.random() < 0.5;
    //   // debugger
    //   startIndex = generateRandomNumberExcludingSome(
    //     shipCoordinates,
    //     ship.length
    //   );
    //   for (let i = 0; i <= ship.length - 1; i++) {
    //     const existing = opponentShipMap.get(ship.shipType);
    //     let coordinate;
    //     if (isHorizontal) {
    //       coordinate = Number(startIndex) + 1 * i;
    //     } else {
    //       coordinate = Number(startIndex) + 10 * i;
    //     }
    //     shipCoordinates.push(coordinate);
    //     opponentShipMap.set(ship.shipType, [
    //       ...existing,
    //       Number(startIndex) + i,
    //     ]);
    //   }
    // });
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
          alert(`You hit opponent's ${ship}. Keep going!`);
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
        alert(`You sank ${currentHitShip}`);
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
        style={{ cursor: "url(./assets/weapon.png), auto" }}
        className={`${
          !props.startGame ? "opacity-40" : ""
        } grid gap-[5px] grid-cols-[repeat(10,30px)] auto-rows-[30px] max-w-fit relative`}
      >
        {[...Array(100).keys()].map((block: number | any) => (
          <div
            onClick={() => fireMissle(block)}
            className={`border border-red-300 rounded-sm p-1 flex justify-center items-center ${
              props.opponentReady ? "pointer-events-none" : ""
            }`}
          >
            {cellStatus[block] && !allPlacedCoordinates.includes(block) ? (
              "X"
            ) : cellStatus[block] && allPlacedCoordinates.includes(block) ? (
              <div className="w-3 h-3 rounded-full bg-red-600"></div>
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
