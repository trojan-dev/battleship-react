import { useDraggable } from "@dnd-kit/core";
import RotateIcon from "../../../assets/RotateIcon";

function ShipComponent({
  ship,
  playerShipsCoordinates,
  isHorizontal,
  setIsHorizontal,
  setPlayerShipsOrientation,
  startGame,
}: any) {
  const { shipType, length, H, V, hDimensions, vDimensions } = ship;
  const { listeners, setNodeRef, transform } = useDraggable({
    id: shipType,
    data: {
      length,
    },
    disabled: startGame,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
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
          zIndex: startGame ? -1 : 0,
        }}
      >
        <img className="h-full w-full ship-image" src={H} alt="" />
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
          <img
            style={
              Object.values(playerShipsCoordinates[shipType])
                .flat(1)
                .some(
                  (el) =>
                    playerShipsCoordinates[shipType].includes(el + 10) ||
                    playerShipsCoordinates[shipType].includes(el - 10)
                )
                ? "relative z-[22]"
                : ""
            }
            src={V}
            className="w-auto flex-grow-1"
            alt=""
          />
        </div>
      </>
    );
  }
}
export default ShipComponent;

{
  /* {active?.id !== shipType &&
        !playerShipsCoordinates[shipType]?.length ? (
          <button onClick={() => rotateShip(true)}>
            <RotateIcon />
          </button>
        ) : null} */
}
