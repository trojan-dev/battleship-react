import { useDroppable } from "@dnd-kit/core";
import DraggableShip from "../Ships";

const SHIPS = [
  {
    shipType: "BATTLESHIP",
    length: 5,
  },
  {
    shipType: "CARRIER",
    length: 4,
  },
  {
    shipType: "CRUISER",
    length: 3,
  },
  {
    shipType: "DESTROYER",
    length: 2,
  },
  {
    shipType: "SUBMARINE",
    length: 2,
  },
];

function DroppableCell({
  id,
  placedShips,
  cellStatus,
}: {
  id: number;
  placedShips: any;
  cellStatus: any;
}) {
  const { setNodeRef } = useDroppable({
    id,
  });
  return (
    <div
      ref={setNodeRef}
      className="border border-white flex justify-center items-center relative z-2"
    >
      {cellStatus[id] && !placedShips.includes(id) ? (
        "X"
      ) : cellStatus[id] && placedShips.includes(id) ? (
        <div className="w-5 h-5 rounded-full bg-red-600 relative z-10"></div>
      ) : (
        ""
      )}
    </div>
  );
}

function PlayerBoard(props: any) {
  return (
    <>
      <h2 className="text-center">Player</h2>
      <div className="relative m-auto flex flex-col">
        <div className="grid grid-cols-[repeat(10,30px)] auto-rows-[30px] relative">
          {[...Array(100).keys()].map((cell) => (
            <DroppableCell
              cellStatus={props.cellStatus}
              placedShips={props.placedShips}
              id={cell}
            />
          ))}
        </div>
        <div className={`flex flex-wrap max-w-[300px] gap-1 my-5`}>
          <DraggableShip isHorizontal={props.isHorizontal} ship={SHIPS[0]} />
          <DraggableShip isHorizontal={props.isHorizontal} ship={SHIPS[1]} />
          <DraggableShip isHorizontal={props.isHorizontal} ship={SHIPS[2]} />
          <DraggableShip isHorizontal={props.isHorizontal} ship={SHIPS[3]} />
          <DraggableShip isHorizontal={props.isHorizontal} ship={SHIPS[4]} />
        </div>
      </div>
    </>
  );
}

export default PlayerBoard;
