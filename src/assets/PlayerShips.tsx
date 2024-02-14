import { Truck5H, Truck5V } from "./Ships/Truck5";
import { Truck4H, Truck4V } from "./Ships/Truck4";
import { Truck3H, Truck3V } from "./Ships/Truck3";
import { Truck2H, Truck2V } from "./Ships/Truck2";
const BASE_CELL_SIZE = 30;
const PlayerShips = [
  {
    shipType: "CARRIER",
    length: 5,
    H: Truck5H,
    V: Truck5V,
    hDimensions: {
      width: BASE_CELL_SIZE * 5,
      height: BASE_CELL_SIZE,
      viewBoxW: BASE_CELL_SIZE * 5 + 50,
      viewBoxH: BASE_CELL_SIZE + 20,
    },
    vDimensions: {
      width: BASE_CELL_SIZE - 5,
      height: BASE_CELL_SIZE * 5 - 5,
      viewBoxW: BASE_CELL_SIZE + 20,
      viewBoxH: BASE_CELL_SIZE * 5 + 20,
    },
  },
  {
    shipType: "BATTLESHIP",
    length: 3,
    H: Truck4H,
    V: Truck4V,
    hDimensions: {
      width: BASE_CELL_SIZE * 3,
      height: BASE_CELL_SIZE,
      viewBoxW: BASE_CELL_SIZE * 3 + 25,
      viewBoxH: BASE_CELL_SIZE + 20,
    },
    vDimensions: {
      width: BASE_CELL_SIZE - 10,
      height: BASE_CELL_SIZE * 3,
      viewBoxW: BASE_CELL_SIZE + 10,
      viewBoxH: BASE_CELL_SIZE * 3 + 20,
    },
  },
  {
    shipType: "CRUISER",
    length: 3,
    H: Truck3H,
    V: Truck3V,
    hDimensions: {
      width: BASE_CELL_SIZE * 3,
      height: BASE_CELL_SIZE,
      viewBoxW: BASE_CELL_SIZE * 3 + 25,
      viewBoxH: BASE_CELL_SIZE + 20,
    },
    vDimensions: {
      width: BASE_CELL_SIZE - 10,
      height: BASE_CELL_SIZE * 3,
      viewBoxW: BASE_CELL_SIZE + 10,
      viewBoxH: BASE_CELL_SIZE * 3 + 20,
    },
  },
  {
    shipType: "DESTROYER",
    length: 3,
    H: Truck3H,
    V: Truck3V,
    hDimensions: {
      width: BASE_CELL_SIZE * 3,
      height: BASE_CELL_SIZE,
      viewBoxW: BASE_CELL_SIZE * 3 + 25,
      viewBoxH: BASE_CELL_SIZE + 20,
    },
    vDimensions: {
      width: BASE_CELL_SIZE - 10,
      height: BASE_CELL_SIZE * 3,
      viewBoxW: BASE_CELL_SIZE + 10,
      viewBoxH: BASE_CELL_SIZE * 3 + 20,
    },
  },
  {
    shipType: "SUBMARINE",
    length: 2,
    H: Truck2H,
    V: Truck2V,
    hDimensions: {
      width: BASE_CELL_SIZE * 2,
      height: BASE_CELL_SIZE,
      viewBoxW: BASE_CELL_SIZE * 2 + 25,
      viewBoxH: BASE_CELL_SIZE + 20,
    },
    vDimensions: {
      width: BASE_CELL_SIZE - 10,
      height: BASE_CELL_SIZE * 2,
      viewBoxW: BASE_CELL_SIZE + 10,
      viewBoxH: BASE_CELL_SIZE * 2 + 30,
    },
  },
];
export default PlayerShips;
