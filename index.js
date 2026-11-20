import { neon } from "@neondatabase/serverless";
import express from "express";
import "dotenv/config";

const sql = neon(process.env.DATABASE_URL);

const app = express();

app.use(express.json());

app.get("/movies", async (req, res) => {
  const { profileId } = req.query;
  const result = profileId
    ? await sql`SELECT * FROM movies WHERE profileId=${profileId}`
    : await sql`SELECT * FROM movies`;
  res.json({ result });
});

app.get("/profiles", async (req, res) => {
  const result = await sql`SELECT * FROM profiles ORDER BY id`;
  res.json({ result });
});

app.post("/movies", async (req, res) => {
  const { title, status, profileId } = req.body;

  const result =
    await sql`INSERT INTO movies(title,status,profileId) values(${title}, ${status}, ${profileId ?? null})`;
  res.json({ result });
});

app.delete("/movies/:id", async (req, res) => {
  const { id } = req.params;

  const result = await sql`DELETE FROM movies WHERE id=${id}`;
  res.json({ result });
});

app.put("/movies/:id", async (req, res) => {
  const { title, status } = req.body;
  const { id } = req.params;

  const result =
    await sql`UPDATE movies SET title=${title}, status=${status} WHERE id=${id}`;
  res.json({ result });
});

app.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
});
