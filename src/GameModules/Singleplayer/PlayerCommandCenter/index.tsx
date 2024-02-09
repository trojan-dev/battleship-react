import { useState } from "preact/hooks";
import DroppableCell from "./Cell";
import ShipComponent from "./ShipComponent";
import { Truck5H, Truck5V } from "../../../assets/Ships/Truck5";
import { Truck3H, Truck3V } from "../../../assets/Ships/Truck3";
import { Truck2H, Truck2V } from "../../../assets/Ships/Truck2";
const BASE_CELL_SIZE = 45;
const BUFFER_FROM_CELL = 0;

const PlayerShips = [
  {
    shipType: "CARRIER",
    length: 5,
    H: Truck5H,
    V: Truck5V,
    hDimensions: `w-[${BASE_CELL_SIZE * 5 - BUFFER_FROM_CELL}px]`,
    vDimensions: `h-[${BASE_CELL_SIZE * 5 - BUFFER_FROM_CELL}px]`,
  },
  {
    shipType: "BATTLESHIP",
    length: 3,
    H: Truck3H,
    V: Truck3V,
    hDimensions: `w-[${BASE_CELL_SIZE * 3 - BUFFER_FROM_CELL}px]`,
    vDimensions: `h-[${BASE_CELL_SIZE * 3 - BUFFER_FROM_CELL}px]`,
  },
  {
    shipType: "CRUISER",
    length: 3,
    H: Truck3H,
    V: Truck3V,
    hDimensions: `w-[${BASE_CELL_SIZE * 3 - BUFFER_FROM_CELL}px]`,
    vDimensions: `h-[${BASE_CELL_SIZE * 3 - BUFFER_FROM_CELL}px]`,
  },
  {
    shipType: "DESTROYER",
    length: 3,
    H: Truck3H,
    V: Truck3V,
    hDimensions: `w-[${BASE_CELL_SIZE * 3 - BUFFER_FROM_CELL}px]`,
    vDimensions: `h-[${BASE_CELL_SIZE * 3 - BUFFER_FROM_CELL}px]`,
  },
  {
    shipType: "SUBMARINE",
    length: 2,
    H: Truck2H,
    V: Truck2V,
    hDimensions: `w-[${BASE_CELL_SIZE * 2 - BUFFER_FROM_CELL}px]`,
    vDimensions: `h-[${BASE_CELL_SIZE * 2 - BUFFER_FROM_CELL}px]`,
  },
];

function PlayerBoard(props: any) {
  const [isHorizontal, setIsHorizontal] = useState({
    BATTLESHIP: true,
    CARRIER: true,
    CRUISER: true,
    DESTROYER: true,
    SUBMARINE: true,
  });
  return (
    <div>
      <div className="flex flex-col relative">
        <div
          className={`grid gap-0.5 grid-cols-[repeat(10,40px)] auto-rows-[40px]`}
        >
          {[...Array(100).keys()].map((cell) => (
            <DroppableCell
              playerCellStatus={props.playerCellStatus}
              placedShips={props.placedShips}
              playerShipsCoordinates={props.playerShipsCoordinates}
              id={cell}
              startGame={props.startGame}
            />
          ))}
        </div>
        <div className={`flex flex-wrap max-w-[400px] gap-1 my-5`}>
          {PlayerShips.map((ship) => (
            <ShipComponent
              isHorizontal={isHorizontal}
              playerShipsCoordinates={props.playerShipsCoordinates}
              setShipOrientation={props.setShipOrientation}
              setIsHorizontal={setIsHorizontal}
              ship={ship}
              startGame={props.startGame}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default PlayerBoard;
