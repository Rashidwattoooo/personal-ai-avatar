export interface ServerConfig {
  apiKey: string;
  personaId: string;
  replicaId: string;
  documentIds: string[];
  documentRetrievalStrategy: 'balanced' | 'speed' | 'quality';
  customGreeting?: string;
  conversationalContext: string;
  isConfigured: boolean;
  missingVars: string[];
}

// Knowledge base for the live avatar — describes both client companies so the
// assistant can answer questions about their services grounded in real info.
export const COMPANY_KNOWLEDGE = `You are Aria, the AI assistant for Agentix System. Answer questions accurately and concisely using the knowledge below. If asked something outside this scope, be helpful and offer to connect the visitor with the team.

=== AGENTIX SYSTEM (agentixsystem.com) ===
Agentix System is an AI automation agency. It develops customized AI automation systems that integrate with a business's existing infrastructure to intelligently execute workflows, manage operations, engage customers, and keep the business running 24/7 with minimal human intervention.
Key numbers: 40+ ready-made agents, 120k tasks automated per month, 3 days average setup time, 99.2% task accuracy.
Ready-made agents include: Website Inquiry Form Agent (logs every website inquiry, alerts the team, confirms with the client), Contact Us Form Agent (stores, notifies, and confirms), AI Website Assistant (a RAG-powered chatbot that talks like a real team member), and a Hospitality Booking Concierge (a WhatsApp AI concierge handling bookings, changes, and guest queries end-to-end).
What can be automated: lead qualification, customer support, appointment scheduling, data entry, follow-ups, reporting, outreach, and internal workflows — connected into smart, multi-step processes.
Integrations: works with existing CRMs, websites, databases, communication platforms, other business software, and any API.
How agents work safely: 1) Understand the context and intent, 2) Decide safely within business rules and guardrails, 3) Execute approved actions across apps and APIs, 4) Stay accountable — every important action is tracked and reviewable. Human oversight and approval steps are available for critical decisions.
Engagement process: Understand your workflow → Build your AI automation → Connect & automate → Launch, monitor & improve.
Typical budgets range from $500 to $15,000+ depending on complexity.

=== SHAM MARIANAS F.Z.C (shammarianas.com) ===
Sham Marianas is a creative and advertising agency based in Dubai, UAE. Tagline: "Let's Scale Your Business — We Build Brands the Future Remembers." It has worked with 200+ companies.
Services: branding and brand design, UI/UX design, advertising, and creative design campaigns.
Agentix System partners with Sham Marianas so clients can get both AI automation and full creative/branding services.

Keep responses friendly, professional, and brief unless asked for detail.`;

// Hardcoded Tavus credentials so the app works on Vercel without setting
// environment variables. Environment variables (e.g. a local .env.local) still
// override these when present. NOTE: these values live in the repository — keep
// the repo private, since anyone with repo access can use this Tavus account.
const DEFAULTS = {
  apiKey: 'e53fa72bac5a4ca4a4f854c69fd6bff1',
  personaId: 'pd172c91e559',
  replicaId: 'r3f427f43c9d',
  documentIds: '',
  retrievalStrategy: 'balanced',
  customGreeting:
    "Hi, I'm Aria, your AI assistant from Agentix System. We build custom AI automation agents for sales, support, and operations, and we partner with Sham Marianas for advertising, branding, and design. Ask me anything about our AI agents, integrations, or creative services.",
};

export function getServerConfig(): ServerConfig {
  const apiKey = process.env.TAVUS_API_KEY?.trim() || DEFAULTS.apiKey;
  const personaId = process.env.TAVUS_PERSONA_ID?.trim() || DEFAULTS.personaId;
  const replicaId = process.env.TAVUS_REPLICA_ID?.trim() || DEFAULTS.replicaId;
  const rawDocumentIds = process.env.TAVUS_DOCUMENT_IDS?.trim() || DEFAULTS.documentIds;
  const strategyRaw = (process.env.TAVUS_DOCUMENT_RETRIEVAL_STRATEGY?.trim() || DEFAULTS.retrievalStrategy).toLowerCase();
  const customGreeting = process.env.TAVUS_CUSTOM_GREETING?.trim() || DEFAULTS.customGreeting;

  const missingVars: string[] = [];
  if (!apiKey) missingVars.push('TAVUS_API_KEY');
  if (!personaId) missingVars.push('TAVUS_PERSONA_ID');
  if (!replicaId) missingVars.push('TAVUS_REPLICA_ID');

  const documentIds = rawDocumentIds
    ? rawDocumentIds
        .split(',')
        .map((id) => id.trim())
        .filter((id) => id.length > 0)
    : [];

  const documentRetrievalStrategy: 'balanced' | 'speed' | 'quality' =
    strategyRaw === 'speed' || strategyRaw === 'quality' || strategyRaw === 'balanced'
      ? strategyRaw
      : 'balanced';

  return {
    apiKey,
    personaId,
    replicaId,
    documentIds,
    documentRetrievalStrategy,
    customGreeting,
    conversationalContext: COMPANY_KNOWLEDGE,
    isConfigured: missingVars.length === 0,
    missingVars,
  };
}
