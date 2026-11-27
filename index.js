import { neon } from "@neondatabase/serverless";
import express from "express";
import "dotenv/config";
import { clerkMiddleware, getAuth } from "@clerk/express";

const sql = neon(process.env.DATABASE_URL);

const app = express();

app.use(express.json());
app.use(clerkMiddleware());

function auth(req, res, next) {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: "Not signed in" });
  req.userId = userId;
  next();
}

app.get("/movies", auth, async (req, res) => {
  const result = await sql`SELECT * FROM movies WHERE user_id=${req.userId}`;
  res.json({ result });
});

app.get("/profiles", async (req, res) => {
  const result = await sql`SELECT * FROM profiles ORDER BY id`;
  res.json({ result });
});

app.post("/movies", auth, async (req, res) => {
  const { title, status } = req.body;

  const result = await sql`INSERT INTO movies(title,status,user_id)
    VALUES(${title}, ${status}, ${req.userId})`;
  res.json({ result });
});

app.put("/movies/:id", auth, async (req, res) => {
  const { title, status } = req.body;

  const result = await sql`UPDATE movies SET title=${title}, status=${status}
   WHERE id=${req.params.id} AND user_id=${req.userId}`;
  res.json({ result });
});

app.delete("/movies/:id", auth, async (req, res) => {
  const result = await sql`DELETE FROM movies
    WHERE id=${req.params.id} AND user_id=${req.userId}`;
  res.json({ result });
});

// Vercel дээр app-ийг export хийхэд л болно, listen зөвхөн local-д.
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export default app;
