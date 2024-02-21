import { useState } from "preact/hooks";
import { useDroppable } from "@dnd-kit/core";
import CellMiss from "../../assets/cell-miss.svg";
import Bombed from "../../assets/bombed.svg";
import BombedSmoke from "../../assets/bombed-smoke.svg";

function DroppableCell({
  id,
  playerCellStatus,
  playerSunkShipsCoordinates,
}: any) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      className={`relative rounded-md aspect-[auto_1/1] w-full bg-[rgb(36,41,42,0.5)]`}
      ref={setNodeRef}
      id={id}
    >
      {playerCellStatus[id] === "MISS" ? <img src={CellMiss} /> : null}
      {playerCellStatus[id] === "EMPTY" ? "" : null}
      {playerCellStatus[id] === "HIT" ? (
        <img width={35} className="bombed absolute top-0" src={Bombed} />
      ) : null}
      {playerSunkShipsCoordinates.includes(id) ? (
        <img width={40} src={BombedSmoke} className="absolute top-0" />
      ) : null}
    </div>
  );
}

export default DroppableCell;
