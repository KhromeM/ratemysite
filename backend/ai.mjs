import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

const responseSchema = z.object({
	summary: z
		.string()
		.describe(
			"What is the website about/selling/informing? should be 1-2 sentances"
		),
	clarityScore: z
		.number()
		.describe(
			"How clear is the text and other content? Is the contrast enough? Is it easy to see what matters?"
		),
	clarityReason: z.string().describe("explanation for clarity score"),
	visualDesignScore: z
		.number()
		.describe("How pleasing is the website to look at?"),
	visualDesignReason: z.string().describe("explanation for visualDesign score"),
	UXScore: z
		.number()
		.describe(
			"is it easy to spot the actions a customer should take? Are there too many call to actions that overwhelm the user?"
		),
	UXReason: z.string().describe("explanation for the UX score"),
	trustScore: z.number().describe("How trustworthy does the website appear?"),
	trustReason: z.string().describe("explanation for the trust score"),
	valuePropositionScore: z
		.number()
		.describe("How clearly is the value communicated to users?"),
	valuePropositionReason: z
		.string()
		.describe("explanation for the value proposition score"),
	consumerScore: z
		.number()
		.describe(
			"Rate the website out of 100 according to the target consumer's pov, -1 if its not for consumers"
		),
	consumerScoreReason: z
		.string()
		.describe("explanation for the consumerScore score"),

	developerScore: z
		.number()
		.describe(
			"Rate the website out of 100 from developer's pov, -1 if its not for developers"
		),
	developerScoreReason: z
		.string()
		.describe("explanation for the developerScore score"),

	investorScore: z
		.number()
		.describe(
			"Rate the website out of 100 from an investor's pov, -1 if its not for investors"
		),
	investorScoreReason: z
		.string()
		.describe("explanation for the investorScore score"),
});

export async function getAIDesignRating(screenshots) {
	const response = await openai.beta.chat.completions.parse({
		model: "gpt-4o",
		messages: [
			{
				role: "user",
				content: [
					{
						type: "text",
						text: `
Analyze this website screenshots using these detailed criteria. All scores should be integers from 0-100 (except audience scores which can be -1 if not applicable):

CLARITY (0-100):
- Text readability (font size, contrast, spacing)
- Information hierarchy
- Clear headlines and subheadings
- Appropriate white space
- Contrast between elements
- Quality of images and graphics
- Scannable content structure

VISUAL DESIGN (0-100):
- Color scheme harmony
- Typography choices
- Layout balance
- Visual hierarchy
- Quality of imagery
- Consistency in design elements
- Modern vs. outdated appearance

USER EXPERIENCE (0-100):
- Intuitive navigation
- Clear call-to-actions (CTAs)
- Number and placement of CTAs
- Form design and usability

TRUST (0-100):
- Social proof (testimonials, reviews, logos)
- Contact information accessibility
- Client/partner logos
- Privacy policy visibility
- Terms of service accessibility
- Copyright information

VALUE PROPOSITION (0-100):
- Immediate clarity of offering
- Benefit communication
- Problem-solution clarity
- Unique selling points
- Competitive advantages
- Feature presentation
- Price-value relationship
- Target audience alignment
- Success metrics/results
- Case studies/examples

AUDIENCE-SPECIFIC SCORING (0-100 or -1):

Consumer Perspective (-1 if N/A):
Consumers can be anyone from a layman to a potential donator if the website is a charity for instance.
Consumers most value clarity, value propositiion, user experience, and trust. Put yourself in the shoes of the a potential consumer and think about how you feel about the site.

Developer Consumer Perspective (-1 if N/A):
Developers are a specialized consumer who highly prize value propositiion and clarity and visual design. They like websites that are more simple or websites that are fancy but tasteful. Put yourself in the shoes of the a potential developer customer and think about how you feel about the site.

Investor Perspective (-1 if N/A):
Investors most value visual design, trust, and value proposition. They like websites that look impressive or are providing a service thats impressive and can grow to a unicorn. Put yourself in the shoes of the a potential investor, would you invest in the company behind this site?
`,
					},
					...screenshots.map((screenshot) => ({
						type: "image_url",
						image_url: {
							url: `data:image/jpeg;base64,${screenshot}`,
						},
					})),
				],
			},
		],
		max_tokens: 4096,
		response_format: zodResponseFormat(responseSchema, "responseSchema"),
	});

	const analysis = JSON.parse(response.choices[0].message.content);
	const score = (
		analysis.clarityScore * 0.3 +
		analysis.visualDesignScore * 0.2 +
		analysis.UXScore * 0.2 +
		analysis.trustScore * 0.1 +
		analysis.valuePropositionScore * 0.2
	).toFixed(2);

	return {
		score,
		analysis,
		usage: response.usage,
	};
}
