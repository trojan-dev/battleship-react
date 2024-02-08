import { useState } from "preact/hooks";
import DroppableCell from "./Cell";
import PlayerShips from "./PlayerShips";
import ShipComponent from "./ShipComponent";

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
          className={`grid gap-1 grid-cols-[repeat(10,40px)] auto-rows-[40px]`}
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
