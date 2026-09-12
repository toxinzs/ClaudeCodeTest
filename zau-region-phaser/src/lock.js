// A single shared input lock. While any dialogue box or scripted cutscene
// is running, map scenes must ignore arrow keys and the interact key —
// otherwise the player walks off mid-conversation, or the Space that
// advances a text page also re-triggers the NPC under it. Counted, not
// boolean, so nested scripts (a choice inside a cutscene) release cleanly.
let count = 0;
export const inputLock = {
  acquire() { count++; },
  release() { count = Math.max(0, count - 1); },
  get locked() { return count > 0; },
  reset() { count = 0; }
};
