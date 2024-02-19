import { useDroppable } from "@dnd-kit/core";
import BoardCell from "../../../assets/Cell";
import CellMiss from "../../../assets/CellMiss";
import Bombed from "../../../assets/Bombed";

function DroppableCell({ id, playerCellStatus, startGame, placedShips }: any) {
  const { setNodeRef, over } = useDroppable({
    id,
  });

  return (
    <div
      className={`flex justify-center items-center ${
        over?.id === id ? "bg-red-500" : ""
      } `}
      ref={setNodeRef}
    >
      {playerCellStatus[id] === "MISS" ? (
        <CellMiss />
      ) : (
        <BoardCell startGame={startGame}>
          {playerCellStatus[id] === "EMPTY" ? "" : null}
          {playerCellStatus[id] === "HIT" ? <Bombed /> : null}
        </BoardCell>
      )}
    </div>
  );
}

export default DroppableCell;
