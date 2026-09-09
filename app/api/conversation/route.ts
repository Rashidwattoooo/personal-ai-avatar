import { NextRequest, NextResponse } from 'next/server';
import { getServerConfig } from '@/app/lib/config';
import { createTavusConversation, endTavusConversation } from '@/app/lib/tavus';
import { sanitizeRetrievalStrategy, parseDocumentIds } from '@/app/lib/validation';

export async function POST(req: NextRequest) {
  try {
    const config = getServerConfig();

    if (!config.isConfigured) {
      return NextResponse.json(
        {
          success: false,
          error: 'Configuration incomplete',
          details: `Missing environment variables: ${config.missingVars.join(', ')}. Please configure .env.local with your Tavus credentials.`,
          missingConfig: config.missingVars,
        },
        { status: 400 }
      );
    }

    let customGreetingOverride: string | undefined;
    let documentIdsOverride: string[] | undefined;
    let strategyOverride: 'balanced' | 'speed' | 'quality' | undefined;

    try {
      const body = await req.json();
      if (body && typeof body === 'object') {
        if (typeof body.customGreeting === 'string') {
          customGreetingOverride = body.customGreeting;
        }
        if (body.documentIds) {
          documentIdsOverride = parseDocumentIds(body.documentIds);
        }
        if (body.retrievalStrategy) {
          strategyOverride = sanitizeRetrievalStrategy(body.retrievalStrategy);
        }
      }
    } catch {
      // Body is optional; proceed with server config defaults
    }

    const conversationData = await createTavusConversation({
      apiKey: config.apiKey,
      personaId: config.personaId,
      replicaId: config.replicaId,
      documentIds: documentIdsOverride ?? config.documentIds,
      documentRetrievalStrategy: strategyOverride ?? config.documentRetrievalStrategy,
      customGreeting: customGreetingOverride ?? config.customGreeting,
      conversationName: `Demo Session - ${new Date().toISOString()}`,
    });

    return NextResponse.json({
      success: true,
      conversationId: conversationData.conversation_id,
      conversationUrl: conversationData.conversation_url,
      status: conversationData.status,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown server error';
    console.error('[API /api/conversation POST Error]:', message);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to initialize conversation session',
        details: message,
      },
      { status: 502 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const config = getServerConfig();
    if (!config.apiKey) {
      return NextResponse.json(
        { success: false, error: 'TAVUS_API_KEY is not configured.' },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json(
        { success: false, error: 'Missing conversationId query parameter.' },
        { status: 400 }
      );
    }

    const ended = await endTavusConversation(conversationId, config.apiKey);
    return NextResponse.json({ success: ended });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown server error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
