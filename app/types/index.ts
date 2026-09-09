export type ConversationState =
  | 'idle'
  | 'requesting-permissions'
  | 'initializing'
  | 'connecting'
  | 'connected'
  | 'speaking'
  | 'listening'
  | 'error'
  | 'ended';

export type CameraStatus = 'off' | 'requesting' | 'active' | 'denied' | 'unsupported';
export type MicrophoneStatus = 'off' | 'active' | 'muted' | 'denied';

export interface TavusConversationResponse {
  conversation_id: string;
  conversation_url: string;
  status: string;
  conversation_name?: string;
  created_at?: string;
}

export interface ConversationApiResponse {
  success: boolean;
  conversationId?: string;
  conversationUrl?: string;
  error?: string;
  details?: string;
  missingConfig?: string[];
}

export interface ConfigStatusResponse {
  isConfigured: boolean;
  hasApiKey: boolean;
  hasPersonaId: boolean;
  hasReplicaId: boolean;
  hasDocumentIds: boolean;
  documentCount: number;
  retrievalStrategy: string;
  mode: 'production' | 'demo';
}

export interface ConversationConfig {
  apiKey: string;
  personaId: string;
  replicaId: string;
  documentIds?: string[];
  documentRetrievalStrategy?: 'balanced' | 'speed' | 'quality';
  customGreeting?: string;
  conversationName?: string;
}
