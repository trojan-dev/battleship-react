import { useDroppable } from "@dnd-kit/core";
import Flame from "../../../assets/Flame/Flame";
function DroppableCell({
  id,
  placedShips,
  cellStatus,
  playerShipsCoordinates,
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
      className="rounded-sm p-1 bg-[#303F48] flex justify-center items-center relative z-2"
    >
      {cellStatus[id] && !placedShips.includes(id) ? (
        // <div className="p-2 rounded-full bg-blue-300 absolute missile-drop-opponent"></div>
        <span className="text-2xl text-black font-extrabold">X</span>
      ) : cellStatus[id] && placedShips.includes(id) ? (
        // <div className="w-3 h-3 rounded-full bg-red-600 relative z-10"></div>
        <>
          {/* <div className="p-2 rounded-full absolute missile-drop-opponent"></div> */}
          <Flame />
        </>
      ) : (
        ""
      )}
    </div>
  );
}

export default DroppableCell;
