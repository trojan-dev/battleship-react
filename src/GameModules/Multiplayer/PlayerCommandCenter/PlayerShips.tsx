import Truck5Horz from "../../../assets/Ships/truck-5-h.svg";
import Truck5Vert from "../../../assets/Ships/truck-5-v.svg";
import Truck3Horz from "../../../assets/Ships/truck-3-h.svg";
import Truck3Vert from "../../../assets/Ships/truck-3-v.svg";
import Truck2Horz from "../../../assets/Ships/truck-2-h.svg";
import Truck2Vert from "../../../assets/Ships/truck-2-v.svg";
const BASE_CELL_SIZE = 45;
const BUFFER_FROM_CELL = 0;
export default [
  {
    shipType: "CARRIER",
    length: 5,
    hComponent: Truck5Horz,
    vComponent: Truck5Vert,
    hDimensions: `w-[${BASE_CELL_SIZE * 5 - BUFFER_FROM_CELL}px]`,
    vDimensions: `h-[${BASE_CELL_SIZE * 5 - BUFFER_FROM_CELL}px]`,
  },
  {
    shipType: "BATTLESHIP",
    length: 3,
    hComponent: Truck3Horz,
    vComponent: Truck3Vert,
    hDimensions: `w-[${BASE_CELL_SIZE * 3 - BUFFER_FROM_CELL}px]`,
    vDimensions: `h-[${BASE_CELL_SIZE * 3 - BUFFER_FROM_CELL}px]`,
  },
  {
    shipType: "CRUISER",
    length: 3,
    hComponent: Truck3Horz,
    vComponent: Truck3Vert,
    hDimensions: `w-[${BASE_CELL_SIZE * 3 - BUFFER_FROM_CELL}px]`,
    vDimensions: `h-[${BASE_CELL_SIZE * 3 - BUFFER_FROM_CELL}px]`,
  },
  {
    shipType: "DESTROYER",
    length: 3,
    hComponent: Truck3Horz,
    vComponent: Truck3Vert,
    hDimensions: `w-[${BASE_CELL_SIZE * 3 - BUFFER_FROM_CELL}px]`,
    vDimensions: `h-[${BASE_CELL_SIZE * 3 - BUFFER_FROM_CELL}px]`,
  },
  {
    shipType: "SUBMARINE",
    length: 2,
    hComponent: Truck2Horz,
    vComponent: Truck2Vert,
    hDimensions: `w-[${BASE_CELL_SIZE * 2 - BUFFER_FROM_CELL}px]`,
    vDimensions: `h-[${BASE_CELL_SIZE * 2 - BUFFER_FROM_CELL}px]`,
  },
];
