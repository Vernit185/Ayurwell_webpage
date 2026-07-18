export interface Metadata {
  request_id: string;
  session_id: string;
  timestamp: string;
  api_version: string;
  reasoning_engine: string;
  processing_time_ms: number;
  dataset_version: string;
}

export interface PredictionData {
  disease_id: string;
  disease_name: string;
  candidates_considered: number;
  top_candidates: string[];
}

export interface ConfidenceData {
  score: number;
  level: string;
  uncertainty_factors: string[];
}

export interface ReasoningTrace {
  matched_symptoms: string[];
  missing_symptoms: string[];
  contradictions: string[];
  eliminated_candidates: number;
}

export interface FollowupQuestion {
  id: string;
  text: string;
}

export interface FollowupData {
  questions: FollowupQuestion[];
  expected_information_gain: number;
}

export interface TreatmentData {
  treatment_intro: string;
  simple_preparations: string;
  compound_preparations: string;
  external_applications: string;
  pathya: string;
  apathya: string;
}

export interface EvidenceSource {
  source: string;
  content: string;
  pages?: string;
}

export interface EvidenceData {
  sources: EvidenceSource[];
}

export interface DoshaData {
  vata: boolean;
  pitta: boolean;
  kapha: boolean;
  notes: string;
}

export interface SafetyAlerts {
  is_emergency: boolean;
  reasons: string[];
}

export interface SessionData {
  turn_count: number;
  positive_findings: string[];
  negative_findings: string[];
}

export interface LLMExplanation {
  text: string;
  generated_at: string;
}

export interface AyurWellResponse {
  metadata: Metadata;
  prediction: PredictionData;
  confidence: ConfidenceData;
  reasoning: ReasoningTrace;
  followup: FollowupData;
  treatments: TreatmentData;
  evidence: EvidenceData;
  dosha: DoshaData;
  safety: SafetyAlerts;
  conversation: SessionData;
  state?: {
    prediction_complete: boolean;
    should_ask_followup: boolean;
    evidence_complete: boolean;
    diagnosis_state: string;
  };
  explanation?: any;
  llm: LLMExplanation;
}

export interface ChatRequest {
  session_id: string;
  query: string;
}

export interface FollowupRequest {
  session_id: string;
  answers: Record<string, boolean>;
}
