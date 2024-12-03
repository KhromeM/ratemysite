import {
	S3Client,
	PutObjectCommand,
	GetObjectCommand,
	ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export function getDomain(url) {
	return new URL(url).hostname;
}

const s3 = new S3Client({
	endpoint: "https://d7e1c0306b47dd63cc68b20ee05e4bbd.r2.cloudflarestorage.com",
	region: "auto",
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID,
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
	},
});

const BUCKET_NAME = "ratemysite";

export async function saveScreenshot(domain, number, buffer) {
	const key = `${domain}/screenshots/screenshot_${number}.png`;
	await s3.send(
		new PutObjectCommand({
			Bucket: BUCKET_NAME,
			Key: key,
			Body: buffer,
			ContentType: "image/png",
		})
	);
	return key;
}

export async function getFirstScreenshot(domain) {
	try {
		const key = `${domain}/screenshots/screenshot_0.png`;
		const command = new GetObjectCommand({
			Bucket: BUCKET_NAME,
			Key: key,
		});

		const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
		return url;
	} catch (error) {
		console.error("Error getting first screenshot URL:", error);
		return null;
	}
}

export async function saveScore(domain, score) {
	const key = `${domain}/scores/score.json`;
	await s3.send(
		new PutObjectCommand({
			Bucket: BUCKET_NAME,
			Key: key,
			Body: JSON.stringify(score, null, 2),
		})
	);

	const scores = await loadGlobalScores();
	scores[domain] = Number(score.score);
	await saveGlobalScores(scores);
}

export async function loadScore(domain) {
	try {
		const key = `${domain}/scores/score.json`;
		const response = await s3.send(
			new GetObjectCommand({
				Bucket: BUCKET_NAME,
				Key: key,
			})
		);
		const data = await response.Body.transformToString();
		return JSON.parse(data);
	} catch {
		return null;
	}
}

export async function loadGlobalScores() {
	try {
		const response = await s3.send(
			new GetObjectCommand({
				Bucket: BUCKET_NAME,
				Key: "scores.json",
			})
		);
		const data = await response.Body.transformToString();
		return JSON.parse(data);
	} catch {
		return {};
	}
}

export async function saveGlobalScores(scores) {
	await s3.send(
		new PutObjectCommand({
			Bucket: BUCKET_NAME,
			Key: "scores.json",
			Body: JSON.stringify(scores, null, 2),
		})
	);
}

export async function getAllScores() {
	try {
		return await loadGlobalScores();
	} catch (error) {
		console.error("Error getting scores:", error);
		return {};
	}
}
