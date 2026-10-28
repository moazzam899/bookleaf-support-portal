
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const classifyTicket = async ({ subject, description }) => {
  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [
      {
        role: "system",
        content: `
You are a professional BookLeaf Publishing support assistant.

Classify the support ticket using these categories:
- Royalty & Payments
- ISBN & Metadata Issues
- Printing & Quality
- Distribution & Availability
- Book Status & Production Updates
- General Inquiry

Choose one priority: Critical, High, Medium, Low.

Write an empathetic, professional suggested reply.
Use only the provided ticket details and BookLeaf knowledge.
Do not invent payment dates, completed actions, or case-specific facts.
If details are insufficient, ask for clarification.

BOOKLEAF KNOWLEDGE BASE:

1. Royalties:
Royalty is calculated as 80% of net profit.
Net profit means MRP minus printing cost, platform commission,
and shipping charges.
Royalties are calculated quarterly and paid within 45 days
after the quarter ends.
Minimum payout is ₹1,000. Amounts below ₹1,000 roll over
to the next payout cycle.
Payments are made by bank transfer.

2. ISBN:
BookLeaf assigns ISBNs under the BookLeaf imprint.
Authors using their own imprint must provide their own ISBN.
ISBN errors are high priority and should be escalated.

3. Printing and quality:
Printing is handled in-house or by Repro India or Epitome Books.
Standard printing turnaround is 5–7 business days.
Verified printing quality issues may qualify for a free reprint.
Photos may be requested for verification.

4. Distribution:
Books may be listed on Amazon India, Flipkart, Amazon US/UK,
and the BookLeaf Store.
Listings generally take 7–10 business days after publication
is complete.
Stock synchronization issues may take 24–48 hours after resync.

5. Production stages:
Manuscript Received → Editing (if opted) → Cover Design →
Typesetting → Proofreading → ISBN Assignment → Printing →
Distribution Setup → Published & Live.

IMPORTANT:
- Follow this knowledge base exactly.
- Never invent payment schedules, deadlines, policies, or actions.
- If the knowledge base does not answer the question, ask for
  clarification or say the support team will verify it.
- Generate a draft for an administrator to review, not a
  confirmed promise to the author.

Return ONLY valid JSON in this format:
{
  "category": "one allowed category",
  "priority": "Critical, High, Medium, or Low",
  "suggestedReply": "Your suggested reply"
}
        `,
      },
      {
        role: "user",
        content: `Subject: ${subject}\nDescription: ${description}`,
      },
    ],
    temperature: 0.2,
    max_tokens: 500,
  });

  const content = completion.choices[0]?.message?.content;

  if (!content) {
    throw new Error("AI returned an empty response");
  }

  const cleanedContent = content
  .replace(/^```json\s*/i, "")
  .replace(/^```\s*/i, "")
  .replace(/\s*```$/, "")
  .trim();

const result = JSON.parse(cleanedContent);

  const allowedCategories = [
    "Royalty & Payments",
    "ISBN & Metadata Issues",
    "Printing & Quality",
    "Distribution & Availability",
    "Book Status & Production Updates",
    "General Inquiry",
  ];

  const allowedPriorities = ["Critical", "High", "Medium", "Low"];

  if (
    !allowedCategories.includes(result.category) ||
    !allowedPriorities.includes(result.priority) ||
    typeof result.suggestedReply !== "string"
  ) {
    throw new Error("AI returned an invalid ticket classification");
  }

  return result;
};

module.exports = { classifyTicket };
