import { useState } from "preact/hooks";
import { useDroppable } from "@dnd-kit/core";
import DroppableCell from "./Cell";
import ShipComponent from "./ShipComponent";
import PlayerShips from "../../assets/PlayerShips";

import { calculateCellStyle } from "../../helper/SIZES";

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
    <div className="flex flex-col items-center">
      {/* {props.startGame ? (
        <div className="flex justify-between w-full gap-3 items-center">
          <div className="flex gap-2">
            <img width={20} src={PlayerFace} alt="" />
            <span className="text-white text-md font-bold">
              {props.currentScore.player}
            </span>
          </div>

          <p className="text-white font-bold opacity-70 mb-1">
            {props.playerReady ? "Your Turn" : "Bot's Turn"}
          </p>

          <div className="flex gap-2">
            <img width={20} src={BotFace} alt="" />
            <span className="text-white text-md font-bold">
              {props.currentScore.bot}
            </span>
          </div>
        </div>
      ) : null} */}
      <section className="relative flex flex-col items-center">
        <div
          className={`${
            props.playerReady ? "opacity-40" : ""
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
          className={`flex flex-wrap gap-2 ${
            !props.startGame
              ? "mt-5 min-h-[100px] w-full max-w-[380px]"
              : "mt-0 max-w-[300px]"
          }`}
          ref={setNodeRef}
        >
          {PlayerShips.map((ship) => (
            <div>
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
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default PlayerBoard;
