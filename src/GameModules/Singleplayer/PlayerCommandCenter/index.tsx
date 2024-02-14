import { useState } from "preact/hooks";
import DroppableCell from "./Cell";
import ShipComponent from "./ShipComponent";
import PlayerShips from "../../../assets/PlayerShips";
import PlayerFace from "../../../assets/PlayerFace.svg";

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
        <div className="flex w-full gap-3 items-center my-3">
          <img width={40} src={PlayerFace} alt="" />
          <span className="text-white text-xl">
            {props.currentScore.player}
          </span>
        </div>
      ) : null}
      <section className="relative flex flex-col items-center">
        <div
          className={`${
            props.playerReady ? "opacity-60" : ""
          } grid grid-cols-[repeat(10,40px)] auto-rows-[40px]`}
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
        <div className={`flex flex-wrap max-w-[400px] gap-2 mt-5`}>
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
      </section>
    </div>
  );
}

export default PlayerBoard;
