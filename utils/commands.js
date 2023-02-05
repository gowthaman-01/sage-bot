import { randomInt } from "crypto";
import { niveytha, ChatGPT, bot, telegraf } from "../bot.js";
import schedule, { scheduleJob } from "node-schedule";
import { getDiet } from "./chatgpt.js";

// Commands
const startCommand = (ctx, mainMenu) => {
  console.log("Bot started!");
  const welcomeMessage =
    "Hello Nivithu Kutty. Get the best out of your day with Sage Bot! Stay on top of diet plans, chat with ChatGPT, find great places to eat, discover fun games to play and recieve lots of love! Have fun :)";
  ctx.reply(welcomeMessage, { reply_markup: mainMenu });
};

const dietCommand = async (ctx) => {
  console.log("Showing diet plan");
  if (niveytha.dietPlan === "") {
    ctx.reply(
      "Diet plan for today has not been generated. Generating a new diet plan specially for you..."
    );
    await getDiet();
  }
  ctx.reply(`Diet plan for today:\n\n${niveytha.dietPlan}`);
};

const generateCommand = async (ctx) => {
  console.log("Generating a new diet plan");
  ctx.reply("Generating a new diet plan specially for you...");
  await getDiet();
  ctx.reply(`Diet plan for today:\n\n${niveytha.dietPlan}`);
};

export { startCommand, dietCommand, generateCommand };
