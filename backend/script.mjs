import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import {
	loadScore,
	saveScore,
	saveScreenshot,
	getDomain,
	getFirstScreenshot,
} from "./utils.mjs";
import { getAIDesignRating } from "./ai.mjs";

puppeteer.use(StealthPlugin());
const isProduction = process.env.NODE_ENV === "production";

const USER_AGENT =
	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

export async function analyzeWebsite(url) {
	const domain = getDomain(url);
	const existingScore = await loadScore(domain);

	if (existingScore) {
		const firstScreenshot = await getFirstScreenshot(domain);
		return {
			...existingScore,
			image: firstScreenshot,
			message: `Retrieved cached score for ${domain}`,
		};
	}

	const browser = await puppeteer.launch({
		headless: isProduction ? "new" : "new", //false,
		args: [
			"--no-sandbox",
			"--disable-setuid-sandbox",
			"--disable-blink-features=AutomationControlled",
			"--enable-javascript",
			"--enable-xhr-timeout", // For AJAX requests
			"--enable-features=NetworkService,NetworkServiceInProcess",
			"--disable-features=IsolateOrigins,site-per-process", // Sometimes needed for scroll behavior
			"--window-size=1920,1080",
			"--no-proxy-server", // Force direct connection
			"--disable-features=ProxyService",
		],
		defaultViewport: null,
	});

	const page = await browser.newPage();

	// Set stealth configurations
	await page.setUserAgent(USER_AGENT);
	await page.setExtraHTTPHeaders({
		"Accept-Language": "en-US,en;q=0.9",
		Accept:
			"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
		"Sec-Fetch-Dest": "document",
		"Sec-Fetch-Mode": "navigate",
		"Sec-Fetch-Site": "none",
		"Sec-Fetch-User": "?1",
	});

	await page.evaluateOnNewDocument(() => {
		Object.defineProperty(navigator, "webdriver", { get: () => false });
		Object.defineProperty(navigator, "plugins", { get: () => [1, 2, 3, 4, 5] });
		window.chrome = { runtime: {} };
	});

	await page.setViewport({
		width: 1920,
		height: 1080,
		deviceScaleFactor: 1,
		hasTouch: false,
		isLandscape: true,
		isMobile: false,
	});

	try {
		await page.goto(url, {
			waitUntil: ["domcontentloaded"],
			timeout: 5000,
		});

		await new Promise((r) => setTimeout(r, 5000));

		const screenshots = [];
		let screenshotCount = 0;
		let lastHeight = await page.evaluate("document.body.scrollHeight");

		while (screenshotCount <= 10) {
			// const randomDelay = Math.floor(Math.random() * 500);
			// await new Promise((r) => setTimeout(r, randomDelay));

			const screenshot = await page.screenshot({
				encoding: "binary",
				fullPage: false,
			});

			saveScreenshot(domain, screenshotCount, screenshot);
			const base64Data = Buffer.from(screenshot).toString("base64");
			screenshots.push(base64Data);
			screenshotCount++;

			await page.evaluate(() => {
				window.scrollBy({
					top: window.innerHeight,
					behavior: "smooth",
				});
			});

			const currentHeight = await page.evaluate(
				"window.pageYOffset + window.innerHeight"
			);
			if (currentHeight >= lastHeight) break;
		}

		await browser.close();

		const { analysis, usage, score } = await getAIDesignRating(screenshots);
		const firstScreenshot = await getFirstScreenshot(domain);
		const result = {
			score,
			analysis,
			screenshots: screenshotCount,
			usage,
			image: firstScreenshot,
		};

		await saveScore(domain, result);
		return result;
	} catch (error) {
		await browser.close();
		throw new Error(`Failed to analyze ${url}: ${error.message}`);
	}
}
