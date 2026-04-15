import { EmojiIdentifierResolvable } from "discord.js";

export const TRANS_EGG_EMOJI = "<:trans_egg:1493987655459934319>";

export const MISC_EMOJIS: EmojiIdentifierResolvable[] = [TRANS_EGG_EMOJI];

const MAGIC_8_BALL_ANSWERS: string[] = [
  "It is certain",
  "It is decidedly so",
  "Without a doubt",
  "Yes definitely",
  "You may rely on it",
  "As I see it, yes",
  "Most likely",
  "Outlook good",
  "Yes",
  "Signs point to yes",
  "Reply hazy, try again",
  "Ask again later",
  "Better not tell you now",
  "Cannot predict now",
  "Concentrate and ask again",
  "Don't count on it",
  "My reply is no",
  "My sources say no",
  "Outlook not so good",
  "Very doubtful",
];

const MAGIC_8_BALL_ANSWERS_DUTCH: string[] = [
  "Het is zeker",
  "Het is beslist zo",
  "Zonder twijfel",
  "Ja, absoluut",
  "Je kunt erop vertrouwen",
  "Zoals ik het zie, ja",
  "Waarschijnlijk wel",
  "Het ziet er goed uit",
  "Ja",
  "De tekenen wijzen op ja",
  "Antwoord is vaag, probeer opnieuw",
  "Vraag het later opnieuw",
  "Beter om het nu niet te zeggen",
  "Nu niet te voorspellen",
  "Concentreer je en vraag opnieuw",
  "Reken er niet op",
  "Mijn antwoord is nee",
  "Mijn bronnen zeggen nee",
  "Het ziet er niet goed uit",
  "Zeer onwaarschijnlijk",
];

export function getTransEggEmoji(): EmojiIdentifierResolvable {
  return TRANS_EGG_EMOJI;
}

export function getMagic8BallAnswer(): string {
  return MAGIC_8_BALL_ANSWERS[
    Math.floor(Math.random() * MAGIC_8_BALL_ANSWERS.length)
  ];
}

export function getMagic8BallAnswerDutch(): string {
  return MAGIC_8_BALL_ANSWERS_DUTCH[
    Math.floor(Math.random() * MAGIC_8_BALL_ANSWERS_DUTCH.length)
  ];
}
