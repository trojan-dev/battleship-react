import { useDroppable } from "@dnd-kit/core";
import BoardCell from "../../../assets/Cell";
import CellMiss from "../../../assets/CellMiss";
import Bombed from "../../../assets/Bombed";
function DroppableCell({ id, playerCellStatus, startGame }: any) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      className={`flex justify-center items-center ${
        isOver ? "bg-red-500" : ""
      }`}
      ref={setNodeRef}
    >
      <BoardCell startGame={startGame}>
        {playerCellStatus[id] === "EMPTY" ? "" : null}
        {playerCellStatus[id] === "MISS" ? <CellMiss /> : null}
        {playerCellStatus[id] === "HIT" ? <Bombed /> : null}
      </BoardCell>
    </div>
  );
}

export default DroppableCell;
