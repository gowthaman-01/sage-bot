import { randomInt } from "crypto";
import { niveytha, telegraf } from "../bot.js";
import schedule, { scheduleJob } from "node-schedule";
import { getDiet, getShortLoveMessage } from "./chatgpt.js";

const sendDiet = async () => {
  console.log("Sending daily plan");
  await getDiet();
  const chatId = niveytha.chatId || "";
  await telegraf.telegram.sendMessage(
    chatId,
    `Kaalai Vannakkamz Pumpkin! Here's your diet plan for today:\n\n${niveytha.dietPlan}`
  );
};

const sendMakeAWish = async () => {
  console.log("Sending make a wish");
  const chatId = niveytha.chatId || "";
  await telegraf.telegram.sendMessage(chatId, "Make a wish :)");
};

const sendGoodNight = async () => {
  console.log("Sending good night");
  const chatId = niveytha.chatId || "";
  await telegraf.telegram.sendMessage(chatId, "Good night babygirl! ");
  await telegraf.telegram.sendMessage(chatId, "Sleep tight, Love you!");
  await telegraf.telegram.sendMessage(chatId, "HUGGIS");
  await telegraf.telegram.sendMessage(chatId, "KISSES");
};

const sendShortLoveMessage = async () => {
  console.log("Sending loving message");
  const chatId = niveytha.chatId || "";
  let shortLoveMessage = await getShortLoveMessage();
  await telegraf.telegram.sendMessage(chatId, shortLoveMessage);
};

const dietRule = new schedule.RecurrenceRule();
dietRule.hour = 9;
dietRule.minute = 0;

const makeAWishRule = new schedule.RecurrenceRule();
makeAWishRule.hour = 11;
makeAWishRule.minute = 11;

const goodNightRule = new schedule.RecurrenceRule();
goodNightRule.hour = 23;
goodNightRule.minute = 30;

const shortLoveMessageRule = new schedule.RecurrenceRule();

scheduleJob(dietRule, sendDiet);
scheduleJob(makeAWishRule, sendMakeAWish);
scheduleJob(goodNightRule, sendGoodNight);
for (let i = 9; i < 24; i += 2) {
  shortLoveMessageRule.hour = i;
  shortLoveMessageRule.minute = randomInt(60);
  scheduleJob(shortLoveMessageRule, sendShortLoveMessage);
}
