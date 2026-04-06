import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import axios from "axios";
import * as cheerio from "cheerio";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API to sync Amazon data
  app.get("/api/sync-amazon", async (req, res) => {
    const { url } = req.query;
    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "URL is required" });
    }

    try {
      // Amazon is very strict. We use a real-looking User-Agent.
      const response = await axios.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
        },
        timeout: 10000,
      });

      const $ = cheerio.load(response.data);

      // Extract Price (Amazon FR selectors)
      // Prices can be in different formats: .a-price-whole, .a-offscreen, etc.
      let priceText = $(".a-price .a-offscreen").first().text().trim();
      if (!priceText) {
        priceText = $(".a-color-price").first().text().trim();
      }
      
      // Clean price string (e.g. "69,99€" -> 69.99)
      let price: number | undefined;
      if (priceText) {
        const cleaned = priceText.replace(/[^\d,.]/g, "").replace(",", ".");
        price = parseFloat(cleaned);
      }

      // Extract Rating
      // Format usually: "4,6 sur 5 étoiles"
      const ratingText = $("#acrPopover").attr("title") || $(".a-icon-alt").first().text().trim();
      let rating: number | undefined;
      if (ratingText) {
        const match = ratingText.match(/(\d[.,]\d)/);
        if (match) {
          rating = parseFloat(match[1].replace(",", "."));
        }
      }

      res.json({ price, rating, success: !!(price || rating) });
    } catch (error) {
      console.error(`Error syncing Amazon data for ${url}:`, error);
      res.status(500).json({ error: "Failed to fetch Amazon data" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
