import { createClient } from "@monorepo/db";

const client = createClient("mongo");

const main = async () => {
  const todos = await client.todo.findMany();
  console.log(todos.length, "found");

  const insert = await client.todo.create({
    data: {
      completed: false,
      task: `Doing something: ${Math.random() * 2024}`,
    },
  });
  console.log(insert);
};

main();
