/** Brand mark. The "A" follows the text colour; the arc uses the accent. */
export function Logo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="92 136 370 230" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M97 355 L250 162 C262 146 286 140 300 156 L375 246 C350 240 320 238 296 239 L289 220 C287 213 281 213 277 218 L170 344 C163 352 156 355 146 355 Z" />
      <path fill="var(--logo-arc, #E8622F)" d="M193 362 C240 300 290 258 340 255 C385 253 425 290 457 362 C420 318 385 293 340 294 C290 296 240 325 193 362 Z" />
    </svg>
  );
}
