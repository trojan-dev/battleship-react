import { useDroppable } from "@dnd-kit/core";
import BoardCell from "../../../assets/Cell";
import CellMiss from "../../../assets/CellMiss";
import Bombed from "../../../assets/Bombed";
function DroppableCell({ id, cellStatus }: any) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div className="flex justify-center items-center" ref={setNodeRef}>
      <BoardCell>
        {cellStatus[id] === "EMPTY" ? "" : null}
        {cellStatus[id] === "MISS" ? <CellMiss /> : null}
        {cellStatus[id] === "HIT" ? <Bombed /> : null}
      </BoardCell>
    </div>
  );
}

export default DroppableCell;
