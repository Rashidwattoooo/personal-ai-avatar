import { NextResponse } from 'next/server';
import { getServerConfig } from '@/app/lib/config';
import { ConfigStatusResponse } from '@/app/types';

export async function GET() {
  const config = getServerConfig();

  const status: ConfigStatusResponse = {
    isConfigured: config.isConfigured,
    hasApiKey: Boolean(config.apiKey),
    hasPersonaId: Boolean(config.personaId),
    hasReplicaId: Boolean(config.replicaId),
    hasDocumentIds: config.documentIds.length > 0,
    documentCount: config.documentIds.length,
    retrievalStrategy: config.documentRetrievalStrategy,
    mode: config.isConfigured ? 'production' : 'demo',
  };

  return NextResponse.json(
    {
      status: 'ok',
      timestamp: new Date().toISOString(),
      config: status,
      missingConfig: config.missingVars,
    },
    { status: 200 }
  );
}
