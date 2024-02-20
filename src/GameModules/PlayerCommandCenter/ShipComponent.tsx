import { useDraggable } from "@dnd-kit/core";
import RotateIcon from "../../assets/RotateIcon";

function ShipComponent({
  ship,
  playerShipsCoordinates,
  isHorizontal,
  setIsHorizontal,
  setPlayerShipsOrientation,
  startGame,
}: any) {
  const { shipType, length, H, V, hDimensions, vDimensions } = ship;
  const { active, listeners, setNodeRef, transform } = useDraggable({
    id: shipType,
    data: {
      length,
    },
    disabled: startGame,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 22,
      }
    : undefined;

  const rotateShip = (isHorizontal: boolean) => {
    setIsHorizontal((prev: any) => ({
      ...prev,
      [shipType]: isHorizontal,
    }));
    setPlayerShipsOrientation((prev: any) => ({
      ...prev,
      [shipType]: isHorizontal ? "H" : "V",
    }));
  };

  if (isHorizontal[shipType]) {
    return (
      <div
        ref={setNodeRef}
        {...listeners}
        id={shipType}
        data-ship={shipType}
        style={{
          ...style,
          width: `${hDimensions.shipWidth}px`,
          height: `${hDimensions.shipHeight}px`,
          display: "flex",
          justifyContent: "center",
          alignItems: "baseline",
        }}
      >
        {/* {active?.id !== shipType &&
        !playerShipsCoordinates[shipType]?.length ? (
          <button
            className="absolute z-22 top-0 left-[50%]"
            onClick={() => alert("dasd")}
          >
            <RotateIcon />
          </button>
        ) : null} */}
        <img className="h-auto w-full ship-image" src={H} alt="" />
      </div>
    );
  } else {
    return (
      <>
        <button onClick={() => rotateShip(true)}>Rotate</button>
        <div
          ref={setNodeRef}
          id={shipType}
          data-ship={shipType}
          style={{
            ...style,
            width: `${vDimensions.shipWidth}px`,
            height: `${vDimensions.shipHeight}px`,
            display: "flex",
          }}
          {...listeners}
        >
          <img className="h-full w-full ship-image" src={V} alt="" />
        </div>
      </>
    );
  }
}
export default ShipComponent;
