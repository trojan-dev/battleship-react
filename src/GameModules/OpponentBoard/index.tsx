import { useEffect, useState } from "preact/hooks";
const SHIPS = [
  {
    shipType: "BATTLESHIP",
    length: 5,
  },
  {
    shipType: "CARRIER",
    length: 4,
  },
  {
    shipType: "CRUISER",
    length: 3,
  },
  {
    shipType: "DESTROYER",
    length: 2,
  },
  {
    shipType: "SUBMARINE",
    length: 2,
  },
];
const opponentShipMap = new Map();

function generateRandomNumberExcludingSome(exclude: any, length: any) {
  const nums = [];
  for (let i = 0; i <= 99; i++) {
    if (
      !exclude.includes(i) &&
      i % 10 < length &&
      !exclude.includes(i + 1 * length - 1)
    )
      nums.push(i);
  }
  if (nums.length === 0) return false;
  const randomIndex = Math.floor(Math.random() * nums.length);
  return nums[randomIndex];
}

function OpponentBoard(props: any) {
  const [shipCoordinatesArr, setPlayerShipsCoordinatesArr] = useState([]);
  const [cellStatus, setCellStatus] = useState(
    [...Array(100).keys()].map((cell) => false)
  );

  function generateOpponentShips() {
    let shipCoordinates: any = [];
    let startIndex;
    SHIPS.forEach((ship) => opponentShipMap.set(ship.shipType, []));
    SHIPS.forEach((ship) => {
      // debugger
      startIndex = generateRandomNumberExcludingSome(
        shipCoordinates,
        ship.length
      );
      for (let i = 0; i <= ship.length - 1; i++) {
        const existing = opponentShipMap.get(ship.shipType);
        const coordinate = Number(startIndex) + 1 * i;
        shipCoordinates.push(coordinate);
        opponentShipMap.set(ship.shipType, [
          ...existing,
          Number(startIndex) + i,
        ]);
      }
    });
    setPlayerShipsCoordinatesArr(shipCoordinates);
  }

  function fireMissle(cell: number) {
    setCellStatus((prev) => ({ ...prev, [cell]: true }));
    props.setPlayerReady(false);
    props.setOpponentReady(true);
  }
  useEffect(() => {
    generateOpponentShips();
  }, []);

  return (
    <div className="relative  p-5 m-auto flex flex-col">
      <h2 className="text-center">Opponent</h2>
      <div
        className={`${
          !props.startGame ? "opacity-40" : ""
        } grid grid-cols-[repeat(10,30px)] auto-rows-[30px] max-w-fit relative`}
      >
        {[...Array(100).keys()].map((block: number | any) => (
          <div
            onClick={() => fireMissle(block)}
            className={`border p-1 flex justify-center items-center ${
              props.opponentReady ? "pointer-events-none" : ""
            }`}
          >
            {cellStatus[block] && !shipCoordinatesArr.includes(block) ? (
              "X"
            ) : cellStatus[block] && shipCoordinatesArr.includes(block) ? (
              <div className="w-5 h-5 rounded-full bg-red-600"></div>
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
