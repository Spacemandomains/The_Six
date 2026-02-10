import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWaitlistSchema } from "@shared/schema";
import { appendToWaitlistSheet } from "./googleSheets";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/waitlist", async (req, res) => {
    try {
      const parsed = insertWaitlistSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          status: "error",
          message: parsed.error.errors[0]?.message || "Invalid email",
        });
      }

      const entry = await storage.addToWaitlist(parsed.data);

      try {
        await appendToWaitlistSheet(parsed.data.email, "WAITLIST");
        console.log("Google Sheet updated for:", parsed.data.email);
      } catch (sheetErr) {
        console.error("Google Sheets forwarding failed:", sheetErr);
      }

      return res.status(200).json({ status: "ok", id: entry.id });
    } catch (err: any) {
      console.error("Waitlist error:", err);
      return res.status(500).json({
        status: "error",
        message: "Something went wrong. Please try again.",
      });
    }
  });

  return httpServer;
}
