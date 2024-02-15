import { useState } from "preact/hooks";
import DroppableCell from "./Cell";
import ShipComponent from "./ShipComponent";
import PlayerShips from "../../../assets/PlayerShips";
import PlayerFace from "../../../assets/PlayerFace.svg";
import BotFace from "../../../assets/BotFace.svg";

function PlayerBoard(props: any) {
  const [isHorizontal, setIsHorizontal] = useState({
    BATTLESHIP: true,
    CARRIER: true,
    CRUISER: true,
    DESTROYER: true,
    SUBMARINE: true,
  });
  return (
    <div className="flex flex-col items-center">
      {props.startGame ? (
        <div className="flex justify-between w-full gap-3 items-center">
          <div className="flex gap-2">
            <img width={20} src={PlayerFace} alt="" />
            <span className="text-white text-md">
              {props.currentScore?.player}
            </span>
          </div>

          <div className="flex gap-2">
            <img width={20} src={BotFace} alt="" />
            <span className="text-white text-md">
              {props.currentScore?.bot}
            </span>
          </div>
        </div>
      ) : null}
      <section className="relative flex flex-col items-center">
        <div
          className={`${
            props.playerTurn ? "opacity-40" : "opacity-100"
          } grid grid-cols-[repeat(10,30px)] auto-rows-[30px]`}
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

        <div
          className={`grid gap-2 grid-cols-2 max-w-[320px] ${
            !props.startGame ? "mt-5" : "mt-0"
          }`}
        >
          {PlayerShips.map((ship) => (
            <div className={`${props.startGame ? "opacity-30" : ""}`}>
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
