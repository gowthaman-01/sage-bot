import express from "express";
import dotenv from "dotenv";
import { ChatGPTAPI } from "chatgpt";
import { Person } from "./classes/Person.js";
import { Bot } from "grammy";
import { Menu } from "@grammyjs/menu";
import { Telegraf } from "telegraf";
import {
  dietCommand,
  generateCommand,
  startCommand,
} from "./utils/commands.js";
import {
  getRecipes,
  getRestaurants,
  getDates,
  getGames,
  getLongLoveMessage,
  chatWithChatGPT,
} from "./utils/chatgpt.js";

// Env variables
dotenv.config();
const BOT_TOKEN = process.env.BOT_TOKEN || "";
const API_KEY = process.env.OPENAI_API_KEY || "";
const port = process.env.PORT || 3000;

// Express
const expressApp = express();
expressApp.get("/", (req, res) => {
  res.send("Bot Launched");
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
const menuMessage = "What would you like to do next baby?";
const continueChatGPTMessage =
  "Would you like to continue chatting with ChatGPT?";

// Telegram bot
const bot = new Bot(BOT_TOKEN);
const telegraf = new Telegraf(BOT_TOKEN);

// ChatGPT
const ChatGPT = new ChatGPTAPI({
  apiKey: API_KEY,
});

// MainMenu
const mainMenu = new Menu("main-menu")
  .text("Display my diet", async (ctx) => await dietCommand(ctx))
  .text("Generate a new diet", async (ctx) => await generateCommand(ctx))
  .row()
  .text("Chat with ChatGPT", async (ctx) => {
    isChattingWithChatGPT = true;
    ctx.reply(
      `Connected to ChatGPT! Input a message to begin your conversation`
    );
  })
  .text("Lookup a meal recipe", async (ctx) => {
    isGettingRecipes = true;
    ctx.reply(`What meal would you like to get the recipe for?`);
  })
  .row()
  .text("Where shall we eat?", async (ctx) => {
    isGettingRestaurants = true;
    ctx.reply(`What are you craving?`);
  })
  .text("Cute date ideas!", async (ctx) => {
    isGettingDates = true;
    ctx.reply(`What theme would you like the date to be based on?`);
  })
  .row()
  .text("Fun game ideas :)", async (ctx) => {
    isGettingGames = true;
    ctx.reply(
      `What are the requirements for the game? Please be as detailed as possible!`
    );
  })
  .text("Recieve love ❤️", async (ctx) => {
    await getLongLoveMessage(ctx);
  });

// Chat menu
const chatMenu = new Menu("chat-menu")
  .text("Yes please", async (ctx) => {
    isChattingWithChatGPT = true;
    setTimeout(() => {
      ctx.reply(`Ok, please type in your reply!`);
    }, 1000);
  })
  .text("No, get me out", async (ctx) => {
    isChattingWithChatGPT = false;
    ctx.reply(`Your chat with ChatGPT has ended!`);
  });

bot.use(mainMenu);
bot.use(chatMenu);

// Start command
bot.command("start", (ctx) => {
  startCommand(ctx, mainMenu);
  niveytha.chatId = ctx.chat.id;
});

// Help command
bot.command("help", (ctx) => {
  ctx.reply(menuMessage, { reply_markup: mainMenu });
});

// Menu command
bot.command("menu", (ctx) => {
  ctx.reply(menuMessage, { reply_markup: mainMenu });
});

// User message
bot.on("message", async (ctx) => {
  if (isChattingWithChatGPT) {
    await chatWithChatGPT(ctx);
    setTimeout(() => {
      ctx.reply(continueChatGPTMessage, { reply_markup: chatMenu });
    }, 1500);
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
    ctx.reply(menuMessage, { reply_markup: mainMenu });
  }
});

// Launch bot
bot.start();

export { niveytha, ChatGPT, bot, telegraf };
