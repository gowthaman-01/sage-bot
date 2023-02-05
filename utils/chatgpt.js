import { niveytha, ChatGPT } from "../bot.js";
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
    `Here is the recipe for ${meal} that you requested:\n\n${recipe.text}`
  );
};

const getRestaurants = async (ctx) => {
  const craving = ctx.message.text;
  ctx.reply(`Suggesting places to eat ${craving} as fast as I can...`);
  console.log(`Cravings: ${craving}`);
  const query = `Suggest places to eat ${craving} in Singapore. Please provide as many options as possible. For each option, please provide some details about the restaurant. Provide the location of the restaurant as well`;
  const places = await ChatGPT.sendMessage(query);
  console.log(`Places:\n${places.text}`);
  ctx.reply(`Here is the places you can have ${craving}:\n\n${places.text}`);
};

const getGames = async (ctx) => {
  ctx.reply(
    "Generating fun and exciting game ideas based on your requirements..."
  );
  const requirements = ctx.message.text;
  console.log(`Requirements: ${requirements}`);
  const query = `Suggest a couple game to play. Here are the requirements - ${requirements}. Please provide as many games as possible and the detailed instructions of how to play them.`;
  const games = await ChatGPT.sendMessage(query);
  console.log(`Game ideas:HAHAH\n${games.text}`);
  ctx.reply(`Game ideas:\n\n${games.text}`);
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
  ctx.reply(`Date ideas:\n\n${dateIdeas.text}`);
};

const getLongLoveMessage = async (ctx) => {
  ctx.reply(
    "I love you kutty! Are you feeling down? Lemme make you feel better..."
  );
  const query =
    "Generate a loving and sweet message for my girlfriend Niveytha. The message should have no apostrophes and no signing off. End with a cute emoji";
  const longLoveMessage = await ChatGPT.sendMessage(query);
  console.log(`Loving quote: ${longLoveMessage.text}`);
  ctx.reply(`${longLoveMessage.text}`);
};

const getShortLoveMessage = async () => {
  const query =
    "Generate a short love message. It has to be different that the previous message. It is very important that the message has no apostrophes and no signing off.";
  const shortLoveMessage = await ChatGPT.sendMessage(query);
  console.log(`Loving quote: ${shortLoveMessage.text}`);
  return shortLoveMessage.text;
};

const chatWithChatGPT = async (ctx) => {
  console.log("Chatting with ChatGPT");
  console.log(`Input text: ${ctx.message.text}`);
  const reply = await ChatGPT.sendMessage(ctx.message.text);
  console.log(`Reply from ChatGPT ${reply.text}`);
  ctx.reply(reply.text);
};

export {
  getDiet,
  getRecipes,
  getRestaurants,
  getDates,
  getGames,
  getShortLoveMessage,
  getLongLoveMessage,
  chatWithChatGPT,
};
