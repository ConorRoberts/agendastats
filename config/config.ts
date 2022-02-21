const live = process.env.NODE_ENV === "production";

export const APP_NAME = "Mini Games";
export const WEBSITE_URL = live ? "https://conorroberts.com" : "http://localhost:3000";

export const GAMES_LIST = [
  {
    title: "Anagrams",
    gameId: "anagrams",
    description: "Given a set of letters, form as many words as possible."
  }
];