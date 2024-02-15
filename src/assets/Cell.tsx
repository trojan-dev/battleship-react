function BoardCell({
  startGame,
  children,
  boardType,
}: {
  startGame: boolean;
  children: React.ReactNode;
  boardType: string;
}) {
  const style = startGame
    ? {
        zIndex: "22",
        position: "relative",
      }
    : {};
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 45 45"
      fill="#FFFF00"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <g id="Boxes">
        <rect
          id="Rectangle 1099"
          width="42.2236"
          height="41.6452"
          rx="7.28792"
          fill="url(#paint0_radial_161_5800)"
          fill-opacity="0.28"
        />
      </g>
      <defs>
        <radialGradient
          id="paint0_radial_161_5800"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(10.4113 12.4936) rotate(43.1221) scale(44.9318 45.5558)"
        >
          <stop stop-color="white" />
          <stop offset="1" stop-color={`#BFBFBF`} />
        </radialGradient>
      </defs>
      <foreignObject x="0" y="0" width="100%" height="100%">
        {children}
      </foreignObject>
    </svg>
  );
}

export default BoardCell;
