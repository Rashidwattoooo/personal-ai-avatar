import { TavusConversationResponse } from '../types';

const TAVUS_API_BASE = 'https://tavusapi.com/v2';

export interface CreateConversationOptions {
  apiKey: string;
  personaId: string;
  replicaId: string;
  documentIds?: string[];
  documentRetrievalStrategy?: 'balanced' | 'speed' | 'quality';
  customGreeting?: string;
  conversationName?: string;
}

export async function createTavusConversation(
  options: CreateConversationOptions
): Promise<TavusConversationResponse> {
  const {
    apiKey,
    personaId,
    replicaId,
    documentIds = [],
    documentRetrievalStrategy = 'balanced',
    customGreeting,
    conversationName = 'Personal AI Avatar Assistant Demo',
  } = options;

  const payload: Record<string, unknown> = {
    persona_id: personaId,
    replica_id: replicaId,
    conversation_name: conversationName,
    properties: {
      max_call_duration: 1800,
      participant_left_timeout: 60,
    },
  };

  if (customGreeting && customGreeting.trim()) {
    payload.custom_greeting = customGreeting.trim();
  }

  if (documentIds.length > 0) {
    payload.document_ids = documentIds;
    payload.document_retrieval_strategy = documentRetrievalStrategy;
  }

  const response = await fetch(`${TAVUS_API_BASE}/conversations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorMessage = `Tavus API Error: ${response.status} ${response.statusText}`;
    try {
      const errorBody = await response.json();
      if (errorBody && typeof errorBody === 'object') {
        const msg = errorBody.message || errorBody.error || JSON.stringify(errorBody);
        errorMessage = `Tavus error (${response.status}): ${msg}`;
      }
    } catch {
      // response wasn't JSON
    }
    throw new Error(errorMessage);
  }

  const data = (await response.json()) as TavusConversationResponse;

  if (!data.conversation_url) {
    throw new Error('Tavus API response did not include a valid conversation_url');
  }

  return data;
}

export async function endTavusConversation(
  conversationId: string,
  apiKey: string
): Promise<boolean> {
  try {
    const response = await fetch(`${TAVUS_API_BASE}/conversations/${conversationId}/end`, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
      },
    });
    return response.ok;
  } catch (error) {
    console.error('Failed to gracefully end Tavus conversation:', error);
    return false;
  }
}
