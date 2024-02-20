import { useState } from "preact/hooks";
import { useDroppable } from "@dnd-kit/core";
import DroppableCell from "./Cell";
import ShipComponent from "./ShipComponent";
import PlayerShips from "../../assets/PlayerShips";

import {
  calculateCellStyle,
  calculateShipsContainer,
} from "../../helper/SIZES";

function PlayerBoard(props: any) {
  const { over, setNodeRef } = useDroppable({
    id: "player-ships",
  });
  const [isHorizontal, setIsHorizontal] = useState({
    BATTLESHIP: true,
    CARRIER: true,
    CRUISER: true,
    DESTROYER: true,
    SUBMARINE: true,
  });
  return (
    <div className={`mt-5 grid place-items-center`}>
      <div
        className={`${
          props.playerReady ? "opacity-50" : ""
        } ${calculateCellStyle()}`}
      >
        {[...Array(63).keys()].map((cell) => (
          <DroppableCell
            playerCellStatus={props.playerCellStatus}
            placedShips={props.placedShips}
            playerShipsCoordinates={props.playerShipsCoordinates}
            id={cell}
            startGame={props.startGame}
          />
        ))}
      </div>
      <div
        className={`grid grow grid-cols-2 gap-3 ${calculateShipsContainer()} ${
          !props.startGame ? "mt-5 w-full" : "mt-0"
        }`}
        ref={setNodeRef}
      >
        {PlayerShips.map((ship) => (
          <ShipComponent
            isHorizontal={isHorizontal}
            playerShipsCoordinates={props.playerShipsCoordinates}
            setShipOrientation={props.setShipOrientation}
            setIsHorizontal={setIsHorizontal}
            ship={ship}
            startGame={props.startGame}
            playerShipsOrientation={props.playerShipsOrientation}
            setPlayerShipsOrientation={props.setPlayerShipsOrientation}
          />
        ))}
      </div>
    </div>
  );
}

export default PlayerBoard;
