import { forwardRef } from "preact/compat";
const Carrier = forwardRef((props: any) => {
  const { ref, ...otherProps } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="60%"
      height="100%"
      viewBox="0 0 205 30"
      fill="none"
      {...otherProps}
    >
      <path
        d="M0.367676 5.69742C0.367676 2.55082 2.9185 0 6.06509 0H146.11C163.642 0 180.97 3.76338 196.922 11.0358L199.314 12.1263C201.537 13.1396 201.537 16.2971 199.314 17.3104L196.922 18.4008C180.97 25.6733 163.642 29.4367 146.11 29.4367H6.0651C2.9185 29.4367 0.367676 26.8858 0.367676 23.7392V5.69742Z"
        fill="#2BB4FF"
        ref={props.ref}
      />
    </svg>
  );
});

export default Carrier;
