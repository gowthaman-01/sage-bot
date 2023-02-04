import { niveytha, ChatGPT, bot } from "./bot.js";
import schedule, { scheduleJob } from "node-schedule";

// Commands
const startCommand = (ctx: any) => {
  console.log("Bot started!");
  const welcomeMessage = `Hello Nivithu Kutty, welcome to the SAGE bot! I love you :)`;
  ctx.reply(welcomeMessage);
  showCommands(ctx);
};

const showCommands = (ctx: any) => {
  console.log("Showing commands");
  const helpMessage = `What would like to do today baby?\n\n/diet - Display the generated diet plan for today\n/generate - Generate a new diet plan\n/chat - Chat with ChatGPT\n/terminate - End chat with ChatGPT\n/recipe - Get the recipe for a meal\n/food - Find places to eat\n/game - Find games to play\n/date - Get date ideas\n/love - Recieve love`;
  ctx.reply(helpMessage);
};

const dietCommand = async (ctx: any) => {
  console.log("Diet command");
  if (niveytha.dietPlan === "") {
    ctx.reply(
      `Diet plan for today has not been generated. Generating a new diet plan. This might take a while...`
    );
    await getDiet();
  }
  ctx.reply(`Diet plan for today:\n${niveytha.dietPlan}`);
};

const generateCommand = async (ctx: any) => {
  console.log(`Generate command`);
  ctx.reply(`Generating a new diet plan. This might take a while...`);
  await getDiet();
  ctx.reply(`Diet plan for today:\n${niveytha.dietPlan}`);
};

// ChatGPT
const getDiet = async () => {
  const prevMealPlan =
    niveytha.dietPlan == ""
      ? ""
      : `This was the meal plan of yesterday ${niveytha.dietPlan} Please generate a new one that is different from this `;
  const query = `$Generate a meal plan of the day for my girlfriend. ${prevMealPlan} She is ${niveytha.age} years old, ${niveytha.weight}kg and ${niveytha.height}cm. She has Polycystic Ovary Syndrome (PCOS). There should be a breakfast, lunch, dinner and snacks, and each of these meals/food should have their calorie breakdown. Please provide much details as possible in well structured manner. Please only include just the meal plan, with no other text before and after it.`;
  const mealPlan = await ChatGPT.sendMessage(query);
  console.log(`Diet plan:\n${mealPlan.text}`);
  niveytha.dietPlan = mealPlan.text;
};

const getRecipes = async (ctx: any) => {
  ctx.reply("Getting recipe. Please hold on...");
  const meal = ctx.message.text;
  console.log(`Meal: ${meal}`);
  const query = `Generate a detailed recipe with ingredients and cooking instructions for ${meal}`;
  const recipe = await ChatGPT.sendMessage(query);
  console.log(`Recipe:\n${recipe.text}`);
  ctx.reply(
    `Here is the recipe for ${meal} that you requested:\n${recipe.text}`
  );
};

const getRestaurants = async (ctx: any) => {
  ctx.reply("Getting restaurants. Please hold on...");
  const craving = ctx.message.text;
  console.log(`Cravings: ${craving}`);
  const query = `Suggest places to eat ${craving} in Singapore. Please provide as many options as possible. For each option, please provide some details about the restaurant. Provide the location of the restaurant as well`;
  const places = await ChatGPT.sendMessage(query);
  console.log(`Places:\n${places.text}`);
  ctx.reply(`Here is the places you can have ${craving}:\n${places.text}`);
};

const getGames = async (ctx: any) => {
  ctx.reply("Getting games. Please hold on...");
  const requirements = ctx.message.text;
  console.log(`Requirements: ${requirements}`);
  const query = `Suggest a couple game to play. Here are the requirements - ${requirements}. Please provide as many games as possible and the detailed instructions of how to play them.`;
  const games = await ChatGPT.sendMessage(query);
  console.log(`Games:\n${games.text}`);
  ctx.reply(`${games.text}`);
};

const getDates = async (ctx: any) => {
  ctx.reply("Getting date ideas. Please hold on...");
  const theme = ctx.message.text;
  console.log(`Theme: ${theme}`);
  const query = `Suggest cute and sweet date ideas with ${theme}.`;
  const dateIdeas = await ChatGPT.sendMessage(query);
  console.log(`Date Ideas:\n${dateIdeas.text}`);
  ctx.reply(`${dateIdeas.text}`);
};

const getLove = async (ctx: any) => {
  ctx.reply(
    `I love you kutty. Are you feeling down? Lemme make you feel better...`
  );
  const query = `Generate a loving and sweet message for my girlfriend Niveytha. The message should have no apostrophes and no signing off. End with a random love emoji`;
  const loveQuote = await ChatGPT.sendMessage(query);
  console.log(`Loving quote: ${loveQuote.text}`);
  ctx.reply(`${loveQuote.text}`);
};

const chatWithChatGPT = async (ctx: any) => {
  console.log(`Input text: ${ctx.message.text}`);
  const reply = await ChatGPT.sendMessage(ctx.message.text);
  console.log(`Reply from ChatGPT ${reply.text}`);
  ctx.reply(reply.text);
};

// Scheduling
const sendDiet = async () => {
  console.log("Sending daily plan");
  await getDiet();
  const chatId = niveytha.chatId || "";
  await bot.telegram.sendMessage(
    chatId,
    `Kaalai Vannakkamz Pumpkin! Here's your diet plan for today:\n\n${niveytha.dietPlan}`
  );
};

const sendMakeAWish = async () => {
  console.log("Sending make a wish");
  const chatId = niveytha.chatId || "";
  await bot.telegram.sendMessage(chatId, `Make a wish :)`);
};

const dietRule = new schedule.RecurrenceRule();
dietRule.hour = 9;
dietRule.minute = 0;

const makeAWishRule = new schedule.RecurrenceRule();
makeAWishRule.hour = 11;
makeAWishRule.second = 11;

scheduleJob(dietRule, sendDiet);
scheduleJob(makeAWishRule, sendMakeAWish);

export {
  startCommand,
  showCommands,
  dietCommand,
  generateCommand,
  getRecipes,
  getRestaurants,
  getGames,
  getLove,
  getDates,
  sendDiet,
  chatWithChatGPT,
};
