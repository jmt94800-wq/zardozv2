import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import axios from "axios";
import * as cheerio from "cheerio";
// @ts-ignore
import ProductAdvertisingAPIv5 from "paapi5-nodejs-sdk";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Function to resolve short links to full URLs
  async function resolveUrl(url: string): Promise<string> {
    try {
      const response = await axios.head(url, {
        maxRedirects: 5,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });
      return response.request.res.responseUrl || url;
    } catch (error) {
      console.error(`Error resolving URL ${url}:`, error);
      return url;
    }
  }

  // Function to extract ASIN from Amazon URL
  function extractAsin(url: string): string | null {
    const match = url.match(/[\/ ]([A-Z0-9]{10})(?:[\/? ]|$)/);
    return match ? match[1] : null;
  }

  // API to sync Amazon data
  app.get("/api/sync-amazon", async (req, res) => {
    const { url } = req.query;
    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "URL is required" });
    }

    // Check if Amazon API credentials are set
    const accessKey = process.env.AMAZON_ACCESS_KEY;
    const secretKey = process.env.AMAZON_SECRET_KEY;
    const associateTag = process.env.AMAZON_ASSOCIATE_TAG;
    const region = process.env.AMAZON_REGION || "eu-west-1";

    if (!accessKey || !secretKey || !associateTag) {
      // Fallback to scraping if credentials are missing
      console.warn("Amazon PA-API credentials missing, falling back to scraping.");
      try {
        const response = await axios.get(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
          },
          timeout: 10000,
        });

        const $ = cheerio.load(response.data);
        let priceText = $(".a-price .a-offscreen").first().text().trim();
        if (!priceText) priceText = $(".a-color-price").first().text().trim();
        
        let price: number | undefined;
        if (priceText) {
          const cleaned = priceText.replace(/[^\d,.]/g, "").replace(",", ".");
          price = parseFloat(cleaned);
        }

        const ratingText = $("#acrPopover").attr("title") || $(".a-icon-alt").first().text().trim();
        let rating: number | undefined;
        if (ratingText) {
          const match = ratingText.match(/(\d[.,]\d)/);
          if (match) rating = parseFloat(match[1].replace(",", "."));
        }

        return res.json({ price, rating, success: !!(price || rating) });
      } catch (error) {
        console.error(`Error syncing Amazon data for ${url}:`, error);
        return res.status(500).json({ error: "Failed to fetch Amazon data" });
      }
    }

    // Use Amazon PA-API
    try {
      const fullUrl = await resolveUrl(url);
      const asin = extractAsin(fullUrl);

      if (!asin) {
        return res.status(400).json({ error: "Could not extract ASIN from URL" });
      }

      const defaultClient = ProductAdvertisingAPIv5.ApiClient.instance;
      defaultClient.accessKey = accessKey;
      defaultClient.secretKey = secretKey;
      defaultClient.host = `paapi.amazon.fr`; // Adjust based on region if needed
      defaultClient.region = region;

      const api = new ProductAdvertisingAPIv5.DefaultApi();
      const getItemsRequest = new ProductAdvertisingAPIv5.GetItemsRequest();
      getItemsRequest["ItemIds"] = [asin];
      getItemsRequest["PartnerTag"] = associateTag;
      getItemsRequest["PartnerType"] = "Associates";
      getItemsRequest["Resources"] = [
        "ItemInfo.Title",
        "Offers.Listings.Price",
        "CustomerReviews.Count",
        "CustomerReviews.StarRating" // Note: This might not be available for all items/regions
      ];

      api.getItems(getItemsRequest, (error: any, data: any, response: any) => {
        if (error) {
          console.error("PA-API Error:", error);
          return res.status(500).json({ error: "PA-API Error" });
        }

        const items = data.ItemsResult.Items;
        if (items && items.length > 0) {
          const item = items[0];
          let price: number | undefined;
          let rating: number | undefined;

          if (item.Offers && item.Offers.Listings && item.Offers.Listings.length > 0) {
            price = item.Offers.Listings[0].Price.Amount;
          }

          // PA-API 5.0 often doesn't return numeric rating directly in a simple way
          // but if it does, it's here. Otherwise we might need to keep scraping for rating.
          if (item.CustomerReviews && item.CustomerReviews.StarRating) {
            rating = item.CustomerReviews.StarRating;
          }

          res.json({ price, rating, success: !!(price || rating) });
        } else {
          res.status(404).json({ error: "Item not found in PA-API" });
        }
      });
    } catch (error) {
      console.error(`Error using PA-API for ${url}:`, error);
      res.status(500).json({ error: "Failed to fetch Amazon data via PA-API" });
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
