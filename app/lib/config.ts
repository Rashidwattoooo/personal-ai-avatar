export interface ServerConfig {
  apiKey: string;
  personaId: string;
  replicaId: string;
  documentIds: string[];
  documentRetrievalStrategy: 'balanced' | 'speed' | 'quality';
  customGreeting?: string;
  isConfigured: boolean;
  missingVars: string[];
}

export function getServerConfig(): ServerConfig {
  const apiKey = process.env.TAVUS_API_KEY?.trim() || '';
  const personaId = process.env.TAVUS_PERSONA_ID?.trim() || '';
  const replicaId = process.env.TAVUS_REPLICA_ID?.trim() || '';
  const rawDocumentIds = process.env.TAVUS_DOCUMENT_IDS?.trim() || '';
  const strategyRaw = process.env.TAVUS_DOCUMENT_RETRIEVAL_STRATEGY?.trim().toLowerCase();
  const customGreeting = process.env.TAVUS_CUSTOM_GREETING?.trim() || undefined;

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
    isConfigured: missingVars.length === 0,
    missingVars,
  };
}
