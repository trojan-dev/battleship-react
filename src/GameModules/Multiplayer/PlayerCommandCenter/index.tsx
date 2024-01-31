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
    <div className="flex flex-col relative">
      <div className="grid gap-2 grid-cols-[repeat(10,35px)] auto-rows-[35px] relative">
        {[...Array(100).keys()].map((cell) => (
          <DroppableCell
            cellStatus={props.cellStatus}
            placedShips={props.placedShips}
            playerShipsCoordinates={props.playerShipsCoordinates}
            id={cell}
          />
        ))}
      </div>
      <div className={`flex flex-wrap max-w-[500px] gap-1 my-5`}>
        {PlayerShips.map((ship) => (
          <ShipComponent
            isHorizontal={isHorizontal}
            playerShipsCoordinates={props.playerShipsCoordinates}
            setShipOrientation={props.setShipOrientation}
            setIsHorizontal={setIsHorizontal}
            ship={ship}
          />
          // <CarrierPiece  />
        ))}
      </div>
    </div>
  );
}

export default PlayerBoard;
