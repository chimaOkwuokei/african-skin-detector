// src/types/patient.ts
export interface CreatePatientPayload {
    name: string;
    date_of_birth: string; // Format: YYYY-MM-DD
    sex: string;
    phone: string;
    location: string;
    teledermatology_consent: boolean;
    research_consent: boolean;
    external_ref: string;
    history_notes: string;
}