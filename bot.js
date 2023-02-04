import { Telegraf } from "telegraf";
import express from "express";
import {
  startCommand,
  dietCommand,
  showCommands,
  generateCommand,
  chatWithChatGPT,
  getRecipes,
  getRestaurants,
  getGames,
  getDates,
  getLove,
} from "./utils.js";
import dotenv from "dotenv";
import { ChatGPTAPI } from "chatgpt";
import { Person } from "./classes/Niveytha.js";

// Env variables
dotenv.config();
const BOT_TOKEN = process.env.BOT_TOKEN || "";
const API_KEY = process.env.OPENAI_API_KEY || "";
const port = process.env.PORT || 3000;

// Express
const expressApp = express();
expressApp.get("/", (req, res) => {
  res.send("App Launched");
});
expressApp.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// Global variables
let isChattingWithChatGPT = false;
let isGettingRecipes = false;
let isGettingRestaurants = false;
let isGettingGames = false;
let isGettingDates = false;
let niveytha = new Person("Niveytha", 21, 169, 57, "");

// Telegram bot
const bot = new Telegraf(BOT_TOKEN);

// ChatGPT
const ChatGPT = new ChatGPTAPI({
  apiKey: API_KEY,
});

// Commands
bot.start((ctx) => {
  startCommand(ctx);
  niveytha.chatId = ctx.message.chat.id;
});

bot.help((ctx) => showCommands(ctx));

bot.command("diet", async (ctx) => await dietCommand(ctx));

bot.command("generate", async (ctx) => await generateCommand(ctx));

bot.command("chat", (ctx) => {
  isChattingWithChatGPT = true;
  console.log("Chatting with Chat");
  ctx.reply(`Connected to ChatGPT. Input a message to begin your conversation`);
});

bot.command("recipe", (ctx) => {
  isGettingRecipes = true;
  console.log("Recipe command");
  ctx.reply(`What meal would you like to get the recipe for?`);
});

bot.command("food", (ctx) => {
  isGettingRestaurants = true;
  console.log("Food command");
  ctx.reply(`What are you craving?`);
});

bot.command("game", (ctx) => {
  isGettingGames = true;
  console.log("Game command");
  ctx.reply(
    `Please input  requirements you have. Please be as detailed as possible`
  );
});

bot.command("date", (ctx) => {
  isGettingDates = true;
  console.log("Date command");
  ctx.reply(`What theme would you like the date to be based on?`);
});

bot.command("love", async (ctx) => {
  console.log("Love command");
  await getLove(ctx);
});

bot.command("terminate", (ctx) => {
  console.log("Terminate ChatGPT");
  isChattingWithChatGPT = false;
  ctx.reply(`Your chat with ChatGPT has ended`);
});

// User message
bot.on("message", async (ctx) => {
  if (isChattingWithChatGPT) {
    await chatWithChatGPT(ctx);
  } else if (isGettingRecipes) {
    await getRecipes(ctx);
    isGettingRecipes = false;
  } else if (isGettingRestaurants) {
    await getRestaurants(ctx);
    isGettingRestaurants = false;
  } else if (isGettingGames) {
    await getGames(ctx);
    isGettingGames = false;
  } else if (isGettingDates) {
    await getDates(ctx);
    isGettingDates = false;
  } else {
    showCommands(ctx);
  }
});

// Launch bot
bot.launch();

export { niveytha, ChatGPT, bot };
