import { useDroppable } from "@dnd-kit/core";
function DroppableCell({
  id,
  placedShips,
  cellStatus,
}: {
  id: number;
  placedShips: any;
  cellStatus: any;
  playerShipsCoordinates: any;
}) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className="border rounded-sm p-2 border-white flex justify-center items-center relative z-2"
    >
      {cellStatus[id] && !placedShips.includes(id) ? (
        "X"
      ) : cellStatus[id] && placedShips.includes(id) ? (
        <div className="w-3 h-3 rounded-full bg-red-600 relative z-10"></div>
      ) : (
        ""
      )}
    </div>
  );
}

export default DroppableCell;
