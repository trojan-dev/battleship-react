function calculateCellStyle() {
  let _cellStyle = `grid grid-cols-[repeat(9,40px)]`;
  if (window.matchMedia("(max-device-width : 475px)").matches) {
    _cellStyle = `grid grid-cols-[repeat(9,40px)]`;
  }
  if (
    window.matchMedia(
      "(min-device-width : 476px) && (max-device-width : 768px)"
    ).matches
  ) {
    console.log("ran");
    _cellStyle = `grid grid-cols-[repeat(9,46px)]`;
  }
  if (window.matchMedia("(min-device-width : 769px)").matches) {
    _cellStyle = `grid grid-cols-[repeat(9,60px)]`;
  }
  return _cellStyle;
}
function calculateCellSize() {
  let _cellSize = 37;
  if (window.matchMedia("(max-device-width : 475px)").matches) {
    console.log("ran");
    _cellSize = 40;
  }
  if (
    window.matchMedia("(min-device-width : 476px) && (max-device-width: 768px)")
      .matches
  ) {
    _cellSize = 46;
  }
  if (window.matchMedia("(min-device-width : 769px)").matches) {
    _cellSize = 60;
  }

  return _cellSize;
}
function calculateShipsContainer() {
  let _cellStyle = `max-w-[500px]`;
  if (window.matchMedia("(min-device-width : 600px)").matches) {
    _cellStyle = `max-w-[500px]`;
  }
  if (window.matchMedia("(min-device-width : 1024px)").matches) {
    _cellStyle = `max-w-[600px]`;
  }
  if (window.matchMedia("(max-device-width : 460px)").matches) {
    _cellStyle = `max-w-[420px]`;
  }
  if (window.matchMedia("(max-device-width : 390px)").matches) {
    _cellStyle = `max-w-[370px]`;
  }
  return _cellStyle;
}
export { calculateCellStyle, calculateCellSize, calculateShipsContainer };
