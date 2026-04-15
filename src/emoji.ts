const LETTER_EMOJIS: Record<string, string> = {
  A: "🇦",
  B: "🇧",
  C: "🇨",
  D: "🇩",
  E: "🇪",
  F: "🇫",
  G: "🇬",
  H: "🇭",
  I: "🇮",
  J: "🇯",
  K: "🇰",
  L: "🇱",
  M: "🇲",
  N: "🇳",
  O: "🇴",
  P: "🇵",
  Q: "🇶",
  R: "🇷",
  S: "🇸",
  T: "🇹",
  U: "🇺",
  V: "🇻",
  W: "🇼",
  X: "🇽",
  Y: "🇾",
  Z: "🇿",
};

export function toLetterEmoji(text: string): string {
  return text
    .toUpperCase()
    .split("")
    .map((c) => LETTER_EMOJIS[c] ?? c)
    .join("");
}

export async function reactSpellWord(message: any, word: string) {
  for (const letter of word.toUpperCase()) {
    const emoji = LETTER_EMOJIS[letter];
    if (!emoji) continue;
    await message.react(emoji);

    await new Promise((r) => setTimeout(r, 400));
  }
}
