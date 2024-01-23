import { useDraggable } from "@dnd-kit/core";
function DraggableShip({
  ship,
  isHorizontal,
}: {
  ship: any;
  isHorizontal: boolean;
}) {
  const { shipType, length } = ship;
  const { listeners, setNodeRef, transform } = useDraggable({
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

  if (isHorizontal) {
    return (
      <div
        id={shipType}
        data-ship={shipType}
        className={`border p-2 rounded-md bg-red-100 cursor-move h-[20px] ${
          shipType === "BATTLESHIP"
            ? "w-[145px]"
            : shipType === "CARRIER"
            ? "w-[115px]"
            : shipType === "CRUISER"
            ? "w-[85px]"
            : shipType === "DESTROYER"
            ? "w-[55px]"
            : "w-[55px]"
        }`}
        ref={setNodeRef}
        style={style}
        {...listeners}
      ></div>
    );
  }

  return (
    <div
      id={shipType}
      data-ship={shipType}
      className={`border p-1 rounded-md bg-red-100 w-[20px] ${
        shipType === "BATTLESHIP"
          ? "h-[145px]"
          : shipType === "CARRIER"
          ? "h-[115px]"
          : shipType === "CRUISER"
          ? "h-[85px]"
          : shipType === "DESTROYER"
          ? "h-[55px]"
          : "h-[55px]"
      }`}
      ref={setNodeRef}
      style={style}
      {...listeners}
    ></div>
  );
}
export default DraggableShip;
