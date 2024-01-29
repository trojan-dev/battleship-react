import {
  CarrierPiece,
  BattleshipPiece,
  CruiserPiece,
  DestroyerPiece,
  SubmarinePiece,
} from "../NewShips";
export default [
  {
    shipType: "CARRIER",
    length: 5,
    render: (props: any) => <CarrierPiece {...props} />,
  },
  {
    shipType: "BATTLESHIP",
    length: 4,
    render: BattleshipPiece,
  },
  {
    shipType: "CRUISER",
    length: 3,
    render: CruiserPiece,
  },
  {
    shipType: "DESTROYER",
    length: 3,
    render: DestroyerPiece,
  },
  {
    shipType: "SUBMARINE",
    length: 2,
    render: SubmarinePiece,
  },
];
