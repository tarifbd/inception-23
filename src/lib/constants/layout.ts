// Shared layout constants that were previously hardcoded independently in more
// than one component, risking silent desync if one copy was ever tweaked alone.

// Header.tsx's scroll-spy: how far past a section's top edge (in px) the fixed
// header is allowed to overlap before that section is considered "active".
export const HEADER_SCROLL_OFFSET_PX = 220;

// IndustriesMarquee.tsx's infinite-scroll keyframe: card width/gap must match
// the Tailwind classes on the marquee cards (`w-[320px]`, `gap-6` = 24px).
export const MARQUEE_CARD_WIDTH_PX = 320;
export const MARQUEE_CARD_GAP_PX = 24;
export const MARQUEE_UNIQUE_ITEM_COUNT = 6;
export const MARQUEE_SCROLL_DISTANCE_PX =
  (MARQUEE_CARD_WIDTH_PX + MARQUEE_CARD_GAP_PX) * MARQUEE_UNIQUE_ITEM_COUNT;
