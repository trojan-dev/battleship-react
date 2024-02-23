import { useDraggable } from "@dnd-kit/core";

function ShipComponent({
  ship,
  playerShipsCoordinates,
  setPlayerShipsCoordinates,
  isHorizontal,
  setIsHorizontal,
  setPlayerShipsOrientation,
  startGame,
  isShipValid,
  setIsShipValid,
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
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(1.05)`,
        opacity: 0.8,
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
  function generateVerticalCoordinatesForTruck(
    playerCoordinates: any,
    shipType: string
  ) {
    const newPlayerCoordinates = { ...playerCoordinates };
    delete newPlayerCoordinates[shipType];
    const allCoordinatesExceptCurrentShip =
      Object.values(newPlayerCoordinates).flat(1);
    const newCoordinateSystem = [playerCoordinates[shipType][0]];
    for (let i = 1; i < playerCoordinates[shipType].length; i++) {
      newCoordinateSystem.push(Number(playerCoordinates[shipType][0] + 9 * i));
    }
    if (
      newCoordinateSystem.some((el) =>
        allCoordinatesExceptCurrentShip.includes(el)
      )
    ) {
      setIsShipValid((prev: any) => ({ ...prev, [shipType]: false }));
      return newCoordinateSystem;
    }

    if (newCoordinateSystem.some((el) => el > 62)) {
      setIsShipValid((prev: any) => ({ ...prev, [shipType]: false }));
      return newCoordinateSystem;
    }
    setIsShipValid((prev: any) => ({ ...prev, [shipType]: true }));
    return newCoordinateSystem;
  }

  function generateHorizontalCoordinatesForTruck(
    playerCoordinates: any,
    shipType: string
  ) {
    const newPlayerCoordinates = { ...playerCoordinates };
    delete newPlayerCoordinates[shipType];
    const allCoordinatesExceptCurrentShip =
      Object.values(newPlayerCoordinates).flat(1);
    const newCoordinateSystem = [playerCoordinates[shipType][0]];
    for (let i = 1; i < playerCoordinates[shipType].length; i++) {
      newCoordinateSystem.push(Number(playerCoordinates[shipType][0] + 1 * i));
    }
    if (
      newCoordinateSystem.some((el) =>
        allCoordinatesExceptCurrentShip.includes(el)
      )
    ) {
      setIsShipValid((prev: any) => ({ ...prev, [shipType]: false }));
      return newCoordinateSystem;
    }
    setIsShipValid((prev: any) => ({ ...prev, [shipType]: true }));
    return newCoordinateSystem;
  }

  if (isHorizontal[shipType]) {
    return (
      <div className="relative">
        <div
          onClick={() => {
            if (playerShipsCoordinates[shipType].length) {
              const newCoordinateSystem = generateVerticalCoordinatesForTruck(
                playerShipsCoordinates,
                shipType
              );
              if (newCoordinateSystem.length) {
                rotateShip(false);
                setPlayerShipsCoordinates((prev: any) => ({
                  ...prev,
                  [shipType]: newCoordinateSystem,
                }));
              }
            }
          }}
          ref={setNodeRef}
          {...listeners}
          id={shipType}
          data-ship={shipType}
          style={{
            ...style,
            width: `${hDimensions.shipWidth}px`,
            height: `${hDimensions.shipHeight}px`,
            zIndex: 1,
            position: "relative",
          }}
        >
          <img
            className={`h-auto w-full ${
              !isShipValid[shipType] ? "opacity-60" : ""
            }`}
            src={H}
            alt=""
          />
        </div>
      </div>
    );
  } else {
    return (
      <div className="relative">
        <div
          onClick={() => {
            if (playerShipsCoordinates[shipType].length) {
              const newCoordinateSystem = generateHorizontalCoordinatesForTruck(
                playerShipsCoordinates,
                shipType
              );
              if (newCoordinateSystem.length) {
                rotateShip(true);
                setPlayerShipsCoordinates((prev: any) => ({
                  ...prev,
                  [shipType]: newCoordinateSystem,
                }));
              }
            }
          }}
          ref={setNodeRef}
          id={shipType}
          data-ship={shipType}
          style={{
            ...style,
            width: `${vDimensions.shipWidth}px`,
            height: `${vDimensions.shipHeight}px`,
            zIndex: 3,
            position: "absolute",
            left: "2px",
          }}
          {...listeners}
        >
          <img
            className={`h-full w-full ship-image object-cover object-[0] ${
              !isShipValid[shipType] ? "opacity-60" : ""
            }`}
            src={V}
            alt=""
          />
        </div>
      </div>
    );
  }
}
export default ShipComponent;
