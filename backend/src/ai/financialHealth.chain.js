const { ChatPromptTemplate } = require('@langchain/core/prompts');
const { StringOutputParser } = require('@langchain/core/output_parsers');
const { RunnableSequence } = require('@langchain/core/runnables');
const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { financialHealthOutputSchema } = require('../validators/ai.validator');

const DEFAULT_MODEL = 'gemini-2.0-flash';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const GEMINI_TIMEOUT_MS = Number(process.env.AI_GEMINI_TIMEOUT_MS || 90_000);

function getGeminiModel() {
  return process.env.GEMINI_MODEL || DEFAULT_MODEL;
}

function stripMarkdownFences(text) {
  let cleaned = String(text).trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();
  }
  return cleaned;
}

function parseModelJson(rawText) {
  const cleaned = stripMarkdownFences(rawText);
  const parsed = JSON.parse(cleaned);
  return financialHealthOutputSchema.parse(parsed);
}

function buildChain(modelName) {
  const llm = new ChatGoogleGenerativeAI({
    model: modelName,
    temperature: 0.3,
    apiKey: process.env.GOOGLE_API_KEY,
    json: true,
    maxOutputTokens: 1200,
  });

  const prompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      `You are a financial literacy coach for a personal finance app.
Your role is educational only. Do not guarantee investment returns, recommend specific stocks, or provide regulated financial advice.
Use only the aggregated metrics provided — never invent numbers.
Respond with valid JSON only matching this shape:
{{
  "healthScore": <integer 1-100>,
  "summary": "<one paragraph assessment>",
  "tips": ["<actionable tip>", "..."],
  "debtAdvice": "<short educational note on debt management>",
  "savingsAdvice": "<short educational note on saving>",
  "literacyTip": "<one financial literacy tip>"
}}`,
    ],
    [
      'human',
      `Analyze these aggregated financial metrics and produce the JSON assessment:

{snapshot}`,
    ],
  ]);

  return RunnableSequence.from([prompt, llm, new StringOutputParser()]);
}

function withTimeout(promise, ms, message) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(message));
    }, ms);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

/**
 * Run LangChain + Gemini financial health assessment on aggregated stats only.
 * @param {object} snapshot - Sanitized metrics (no PII)
 * @returns {Promise<import('zod').infer<typeof financialHealthOutputSchema>>}
 */
async function runFinancialHealthChain(snapshot) {
  if (!process.env.GOOGLE_API_KEY) {
    const err = new Error(
      'GOOGLE_API_KEY is not configured. Add your Google AI Studio key to backend/.env'
    );
    err.statusCode = 503;
    throw err;
  }

  const modelName = getGeminiModel();
  const chain = buildChain(modelName);
  const snapshotText = JSON.stringify(snapshot, null, 2);

  const raw = await withTimeout(
    chain.invoke({ snapshot: snapshotText }),
    GEMINI_TIMEOUT_MS,
    `Gemini request timed out after ${Math.round(GEMINI_TIMEOUT_MS / 1000)}s`
  );

  try {
    return parseModelJson(raw);
  } catch (parseError) {
    const err = new Error(
      `AI response could not be parsed: ${parseError.message}`
    );
    err.statusCode = 502;
    throw err;
  }
}

module.exports = {
  runFinancialHealthChain,
  getGeminiModel,
  CACHE_TTL_MS,
  GEMINI_TIMEOUT_MS,
};
