import { Request, Response } from "express";
import puppeteer from "puppeteer";

export const scrape = async (req: Request, res: Response) => {
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    headless: true,
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  // Set the page to go and scrape
  await page.goto(
    "https://www.syntra-ab.be/opleidingen/type/voltijds-overdag",
    {
      waitUntil: "networkidle0",
    }
  );
  const data = await page.evaluate(() => {
    const titles = document.querySelectorAll(".header h2 a");

    return Array.from(titles).map((title) => title.textContent?.trim() || "");
  });
  await browser.close();
  res.status(200).json(data);
};
