import { useState } from "preact/hooks";
import { useDroppable } from "@dnd-kit/core";
import CellMiss from "../../assets/CellMiss";
import Bombed from "../../assets/bombed.svg";
import BombedSmoke from "../../assets/bombed-smoke.svg";

function DroppableCell({ id, playerCellStatus, startGame }: any) {
  const { setNodeRef, over } = useDroppable({
    id,
  });

  return (
    <div
      className={`${
        startGame ? "relative" : ""
      } rounded-md aspect-square w-full ${
        over?.id === id ? "bg-red-500" : "bg-[rgb(36,41,42,0.5)]"
      } `}
      ref={setNodeRef}
      id={id}
    >
      {playerCellStatus[id] === "MISS" ? <CellMiss /> : null}
      {playerCellStatus[id] === "EMPTY" ? "" : null}
      {playerCellStatus[id] === "HIT" ? (
        <img width={40} className="bombed absolute top-0" src={Bombed} />
      ) : null}
    </div>
  );
}

export default DroppableCell;
