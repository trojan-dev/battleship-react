import { useDraggable } from "@dnd-kit/core";
import RotateIcon from "../../assets/RotateIcon";

function DraggableShip({
  ship,
  playerShipsCoordinates,
  setShipOrientation,
  isHorizontal,
  setIsHorizontal,
}: any) {
  const { shipType, length } = ship;
  const { active, listeners, setNodeRef, transform } = useDraggable({
    id: shipType,
    data: {
      length,
    },
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;
  if (isHorizontal[shipType]) {
    return (
      <div className="flex items-center p-1 gap-1">
        <div
          id={shipType}
          data-ship={shipType}
          className={`border p-2 rounded-md bg-red-100 cursor-move  ${
            shipType === "BATTLESHIP"
              ? "w-[155px]"
              : shipType === "CARRIER"
              ? "w-[125px]"
              : shipType === "CRUISER"
              ? "w-[95px]"
              : shipType === "DESTROYER"
              ? "w-[95px]"
              : "w-[65px]"
          }`}
          ref={setNodeRef}
          style={style}
          {...listeners}
        ></div>
        {active?.id !== shipType &&
        !playerShipsCoordinates[shipType]?.length ? (
          <button
            onClick={() => {
              console.log("sad");
              setIsHorizontal((prev: any) => ({ ...prev, [shipType]: false }));
              setShipOrientation((prev: any) => ({
                ...prev,
                [shipType]: "vertical",
              }));
            }}
          >
            <RotateIcon />
          </button>
        ) : null}
      </div>
    );
  } else {
    return (
      <div className="flex gap-2 items-center gap-1">
        <div
          id={shipType}
          data-ship={shipType}
          className={`cursor-move border p-2 rounded-md bg-red-100 ${
            shipType === "BATTLESHIP"
              ? "h-[155px]"
              : shipType === "CARRIER"
              ? "h-[125px]"
              : shipType === "CRUISER"
              ? "h-[95px]"
              : shipType === "DESTROYER"
              ? "h-[95px]"
              : "h-[65px]"
          }`}
          ref={setNodeRef}
          style={style}
          {...listeners}
        ></div>
        {active?.id !== shipType &&
        !playerShipsCoordinates[shipType]?.length ? (
          <button
            onClick={() => {
              setIsHorizontal((prev: any) => ({ ...prev, [shipType]: true }));
              setShipOrientation((prev: any) => ({
                ...prev,
                [shipType]: "vertical",
              }));
            }}
          >
            <RotateIcon />
          </button>
        ) : null}
      </div>
    );
  }
}
export default DraggableShip;
