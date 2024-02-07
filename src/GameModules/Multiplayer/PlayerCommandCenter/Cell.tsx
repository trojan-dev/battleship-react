import { useDroppable } from "@dnd-kit/core";
import Flame from "../../../assets/Flame/Flame";
function DroppableCell({ id, placedShips, cellStatus }: any) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className="rounded-sm p-1 bg-[#303F48] flex justify-center items-center relative z-2"
    >
      {cellStatus[id] === "EMPTY" ? "" : null}
      {cellStatus[id] === "MISS" ? "O" : null}
      {cellStatus[id] === "HIT" ? <Flame /> : null}
    </div>
  );
}

export default DroppableCell;
