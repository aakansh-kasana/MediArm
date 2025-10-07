import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width="32"
      height="32"
      {...props}
    >
      <g fill="hsl(var(--primary))">
        <path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88Z" />
        <path d="M168 88h-16a8 8 0 0 0-8 8v48a8 8 0 0 0 8 8h16a8 8 0 0 0 0-16h-8v-16h8a8 8 0 0 0 0-16h-8V96h8a8 8 0 0 0 0-16Zm-80 0h24a8 8 0 0 0 0-16H88a8 8 0 0 0-8 8v56a8 8 0 0 0 16 0v-20h16a8 8 0 0 0 0-16H96v-8h24a8 8 0 0 0 0-16Z" />
      </g>
    </svg>
  );
}
