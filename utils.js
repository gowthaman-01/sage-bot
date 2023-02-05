import { niveytha, ChatGPT, bot } from "./bot.js";
import schedule, { scheduleJob } from "node-schedule";

// Commands
const startCommand = (ctx, mainMenu) => {
  console.log("Bot started!");
  const welcomeMessage = `Hello Nivithu Kutty. Get the best out of your day with Sage Bot! Stay on top of diet plans, chat with ChatGPT, find great places to eat, discover fun games to play and recieve lots of love! Have fun :)`;
  ctx.reply(welcomeMessage, { reply_markup: mainMenu });
};

const dietCommand = async (ctx) => {
  console.log("Showing diet plan");
  if (niveytha.dietPlan === "") {
    ctx.reply(
      `Diet plan for today has not been generated. Generating a new diet plan specially for you...`
    );
    await getDiet();
  }
  ctx.reply(`Diet plan for today:\n${niveytha.dietPlan}`);
};

const generateCommand = async (ctx) => {
  console.log(`Generating a new diet plan`);
  ctx.reply(`Generating a new diet plan specially for you...`);
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

const getRecipes = async (ctx) => {
  const meal = ctx.message.text;
  ctx.reply(`Finding the recipe for ${meal}...`);
  console.log(`Meal: ${meal}`);
  const query = `Generate a detailed recipe with ingredients and cooking instructions for ${meal}`;
  const recipe = await ChatGPT.sendMessage(query);
  console.log(`Recipe:\n${recipe.text}`);
  ctx.reply(
    `Here is the recipe for ${meal} that you requested:\n${recipe.text}`
  );
};

const getRestaurants = async (ctx) => {
  const craving = ctx.message.text;
  ctx.reply(`Suggesting places to eat ${craving} as fast as I can...`);
  console.log(`Cravings: ${craving}`);
  const query = `Suggest places to eat ${craving} in Singapore. Please provide as many options as possible. For each option, please provide some details about the restaurant. Provide the location of the restaurant as well`;
  const places = await ChatGPT.sendMessage(query);
  console.log(`Places:\n${places.text}`);
  ctx.reply(`Here is the places you can have ${craving}:\n${places.text}`);
};

const getGames = async (ctx) => {
  ctx.reply(
    "Generating fun and exciting game ideas based on your requirements..."
  );
  const requirements = ctx.message.text;
  console.log(`Requirements: ${requirements}`);
  const query = `Suggest a couple game to play. Here are the requirements - ${requirements}. Please provide as many games as possible and the detailed instructions of how to play them.`;
  const games = await ChatGPT.sendMessage(query);
  console.log(`Games:\n${games.text}`);
  ctx.reply(`${games.text}`);
};

const getDates = async (ctx) => {
  ctx.reply(
    "Coming up with cute date ideas. In the meantime, go get dressed..."
  );
  const theme = ctx.message.text;
  console.log(`Theme: ${theme}`);
  const query = `Suggest cute and sweet date ideas with ${theme}.`;
  const dateIdeas = await ChatGPT.sendMessage(query);
  console.log(`Date Ideas:\n${dateIdeas.text}`);
  ctx.reply(`${dateIdeas.text}`);
};

const getLove = async (ctx) => {
  ctx.reply(
    `I love you kutty! Are you feeling down? Lemme make you feel better...`
  );
  const query = `Generate a loving and sweet message for my girlfriend Niveytha. The message should have no apostrophes and no signing off. End with a cute emoji`;
  const loveQuote = await ChatGPT.sendMessage(query);
  console.log(`Loving quote: ${loveQuote.text}`);
  ctx.reply(`${loveQuote.text}`);
};

const chatWithChatGPT = async (ctx) => {
  console.log("Chatting with ChatGPT");
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
