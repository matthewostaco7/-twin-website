import type { ReactNode } from "react";

/**
 * Stickers for the intro block: a wobbly die-cut blob in a brand colour, a second blob offset behind it
 * for the lifted-edge look, and a heavy ink line icon on top. Each blob is its own shape so no two match.
 */
const BLOBS = [
  "M62 8C88 6 112 22 112 50C114 78 98 108 66 112C36 116 10 98 8 64C6 34 30 10 62 8Z",
  "M56 10C84 4 114 26 110 58C108 86 92 112 60 110C30 108 6 90 10 58C12 30 30 14 56 10Z",
  "M64 6C92 10 114 30 108 62C104 92 86 114 54 110C24 106 8 82 12 52C16 24 38 4 64 6Z",
  "M58 8C86 8 110 28 112 56C112 86 90 112 58 112C28 110 8 88 8 58C8 30 30 8 58 8Z",
];

type Props = { n: number; fill: string; back: string; className: string; children: ReactNode };

function Sticker({ n, fill, back, className, children }: Props) {
  return (
    <svg className={"stk " + className} viewBox="0 0 120 120" aria-hidden="true">
      <path d={BLOBS[n]} transform="translate(5 7)" fill={back} />
      <path d={BLOBS[n]} fill={fill} />
      <g className="stk-ink">{children}</g>
    </svg>
  );
}

export default function Stickers() {
  return (
    <div className="stickers" aria-hidden="true">
      <Sticker n={0} fill="#FFD7A3" back="#FF9D2E" className="stk-a">
        <path d="M60 30l7 23 23 7-23 7-7 23-7-23-23-7 23-7z" />
      </Sticker>
      <Sticker n={1} fill="#F1F5F9" back="#B4C0D0" className="stk-b">
        <path d="M40 82l5-17 31-31 12 12-31 31z" />
        <path d="M70 40l12 12" />
      </Sticker>
      <Sticker n={2} fill="#FFE6C8" back="#F2A24A" className="stk-c">
        <path d="M34 36h52a8 8 0 0 1 8 8v26a8 8 0 0 1-8 8H62L44 94V78H34a8 8 0 0 1-8-8V44a8 8 0 0 1 8-8z" />
      </Sticker>
      <Sticker n={3} fill="#F1F5F9" back="#B4C0D0" className="stk-d">
        <path d="M42 32l42 30-20 4-8 20z" />
      </Sticker>
    </div>
  );
}
