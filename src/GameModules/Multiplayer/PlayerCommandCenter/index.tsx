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
    <div className="mb-20">
      <div className="flex flex-col relative">
        <div className={`grid grid-cols-[repeat(10,45px)] auto-rows-[45px]`}>
          {[...Array(100).keys()].map((cell) => (
            <DroppableCell
              cellStatus={props.cellStatus}
              placedShips={props.placedShips}
              playerShipsCoordinates={props.playerShipsCoordinates}
              id={cell}
              playerTurn={props.playerTurn}
              opponentTurn={props.opponentTurn}
            />
          ))}
        </div>
        <div className={`flex flex-wrap max-w-[400px] gap-1 my-5`}>
          {PlayerShips.map((ship) => (
            <ShipComponent
              isHorizontal={isHorizontal}
              playerShipsCoordinates={props.playerShipsCoordinates}
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
