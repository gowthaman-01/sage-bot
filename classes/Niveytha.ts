class Person {
  name: string;
  age: number;
  height: number;
  weight: number;
  dietPlan: string;
  chatId?: string | number;

  constructor(
    name: string,
    age: number,
    height: number,
    weight: number,
    dietPlan: string
  ) {
    this.name = name;
    this.age = age;
    this.height = height;
    this.weight = weight;
    this.dietPlan = dietPlan;
  }
}

export { Person };
