import { Hono } from "hono";
import { serve } from "@hono/node-server";

import { safetry } from "@monorepo/utils";
import { createClient } from "@monorepo/db";
import { add, square } from "@monorepo/calculator";

const client = createClient("mongo");
const app = new Hono();

app.get("/", (c) => c.text("Hello Deno!"));

app.get("/add/:first/:second", (c) =>
  c.json(add(Number(c.req.param().first), Number(c.req.param().second))),
);
app.get("/square/:value", (c) => c.json(square(Number(c.req.param().value))));

app.post("/todos", async (c) => {
  const data = await c.req.json();
  const result = await safetry(client.todo.create({ data }));
  if (!result.success) {
    return c.json({ error: result.error }, 500);
  }
  return c.json({ success: true, data }, 201);
});

app.get("/todos", async (c) => {
  const result = await safetry(client.todo.findMany());
  if (!result.success) {
    return c.json({ error: result.error }, 500);
  }
  return c.json({ success: true, result }, 201);
});

app.get("/todos/:todoId", async (c) => {
  const id = c.req.param().todoId;
  console.log(id);
  const result = await safetry(client.todo.findFirst({ where: { id: id } }));
  if (!result.success) {
    return c.json({ error: result.error }, 500);
  }
  return c.json({ success: true, result }, 200);
});

serve({
  fetch: app.fetch,
  port: 8000,
});
