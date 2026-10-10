export interface PlacePopupOptions {
  /** Which edge of the anchor the popup lines up with. Default 'end'. */
  align?: 'start' | 'end';
  /** Minimum distance to the viewport edges, in px. Default 8. */
  margin?: number;
  /** Distance between the anchor and the popup, in px. Default 4. Use 0 if the popup has its own margin. */
  gap?: number;
  /** Always open in this direction instead of picking the side with room. */
  direction?: 'up' | 'down';
}

/**
 * Works out where a popup (dropdown, list) should go so it never leaves the screen.
 *
 * `anchor` is the element the popup belongs to. It must be the popup's offset parent (`position: relative`).
 * The popup is aligned to the anchor's start or end edge, then pushed back inside the viewport. It opens
 * downward when it fits, otherwise upward, otherwise on the side with more room, and scrolls if it still doesn't fit
 * (unless `direction` forces a side).
 * Returns inline styles to bind with `[style]`.
 */
export function placePopup(anchor: HTMLElement, popup: HTMLElement, options: PlacePopupOptions = {}): Record<string, string> {
  const { align = 'end', margin = 8, gap = 4, direction } = options;
  const rect = anchor.getBoundingClientRect();
  const width = popup.offsetWidth;
  const height = Math.max(popup.offsetHeight, popup.scrollHeight);
  const viewportWidth = document.documentElement.clientWidth;
  const viewportHeight = document.documentElement.clientHeight;

  // Horizontal: preferred edge, then clamped into the viewport.
  const preferred = align === 'end' ? rect.right - width : rect.left;
  const left = Math.max(margin, Math.min(preferred, viewportWidth - margin - width));

  // Vertical: below if it fits, else above, else the side with more room.
  const below = viewportHeight - rect.bottom - margin - gap;
  const above = rect.top - margin - gap;
  const down = direction ? direction === 'down' : height <= below || below >= above;
  const room = Math.max(down ? below : above, 0);

  const style: Record<string, string> = {
    visibility: 'visible',
    left: `${left - rect.left}px`,
    right: 'auto',
    maxWidth: `${viewportWidth - 2 * margin}px`,
    top: down ? `${rect.height + gap}px` : 'auto',
    bottom: down ? 'auto' : `${rect.height + gap}px`
  };
  if (height > room) {
    style['maxHeight'] = `${room}px`;
    style['overflowY'] = 'auto';
  }
  return style;
}
