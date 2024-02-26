import { useDroppable } from "@dnd-kit/core";
import CellMiss from "../../assets/cell-miss.png";
import Bombed from "../../assets/bombed.svg";
import BombedSmoke from "../../assets/bombed-smoke.svg";

function DroppableCell({
  id,
  playerCellStatus,
  placedShips,
  startGame,
  playerSunkShipsCoordinates,
}: any) {
  const { over, setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      className={`${over?.id === id ? "bg-red-500" : "bg-[rgb(36,41,42,1)]"} ${
        startGame && placedShips.includes(id) ? "bg-[#4D565C]" : ""
      } border border-[rgb(36,41,42,0.5)] relative rounded-md aspect-[auto_1/1] w-full `}
      ref={setNodeRef}
      id={id}
    >
      {playerCellStatus[id] === "MISS" ? (
        <div className="flex justify-center items-center h-full">
          <img className="w-[70%]" src={CellMiss} />
        </div>
      ) : null}
      {playerCellStatus[id] === "EMPTY" ? "" : null}
      {playerCellStatus[id] === "HIT" ? (
        <img width={35} className="bombed absolute top-0 z-[33]" src={Bombed} />
      ) : null}
      {playerSunkShipsCoordinates.includes(id) ? (
        <img width={40} src={BombedSmoke} className="absolute top-0 z-[33]" />
      ) : null}
    </div>
  );
}

export default DroppableCell;
