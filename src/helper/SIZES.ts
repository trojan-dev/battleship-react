function calculateCellStyle() {
  let _cellStyle = `grid grid-cols-[repeat(9,32px)] auto-rows-[32px] gap-1`;
  if (window.matchMedia("(max-device-width : 475px)").matches) {
    _cellStyle = `grid grid-cols-[repeat(9,32px)] auto-rows-[32px] gap-1`;
  }
  if (
    window.matchMedia("(min-device-width : 376px) && (max-device-width: 475px)")
      .matches
  ) {
    _cellStyle = `grid grid-cols-[repeat(9,35px)] auto-rows-[35px] gap-1`;
  }
  if (
    window.matchMedia(
      "(min-device-width : 476px) && (max-device-width : 768px)"
    ).matches
  ) {
    _cellStyle = `grid grid-cols-[repeat(9,40px)] auto-rows-[40px] gap-1`;
  }
  if (window.matchMedia("(min-device-width : 769px)").matches) {
    _cellStyle = `grid grid-cols-[repeat(9,42px)] auto-rows-[42px] gap-1`;
  }
  return _cellStyle;
}
function calculateCellSize() {
  let _cellSize = 32;
  if (window.matchMedia("(max-device-width : 475px)").matches) {
    _cellSize = 32;
  }
  if (
    window.matchMedia("(min-device-width : 376px) && (max-device-width: 475px)")
      .matches
  ) {
    _cellSize = 35;
  }
  if (
    window.matchMedia("(min-device-width : 476px) && (max-device-width: 768px)")
      .matches
  ) {
    _cellSize = 40;
  }
  if (window.matchMedia("(min-device-width : 769px)").matches) {
    _cellSize = 42;
  }

  return _cellSize;
}
function calculateShipsContainer() {
  let _cellStyle = `max-w-[320px]`;
  if (window.matchMedia("(max-device-width : 375px)").matches) {
    _cellStyle = `max-w-[320px]`;
  }
  if (
    window.matchMedia("(min-device-width : 376px) && (max-device-width: 475px)")
      .matches
  ) {
    _cellStyle = `max-w-[350px]`;
  }
  if (
    window.matchMedia(
      "(min-device-width : 476px) && (max-device-width : 768px)"
    ).matches
  ) {
    _cellStyle = `max-w-[400px]`;
  }
  if (window.matchMedia("(min-device-width : 769px)").matches) {
    _cellStyle = `max-w-[420px]`;
  }
  return _cellStyle;
}
export { calculateCellStyle, calculateCellSize, calculateShipsContainer };
