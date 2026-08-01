import axios from "axios";

export interface DemandePaiementPayload {
  telephone: string;
  codeTypeForfait: number;
  operateur: string;
  nomClient?: string;
}

export interface DemandePaiementResponse {
  success: boolean;
  message: string;
  ticket: {
    code: string;
    expiration: string;
    forfait: string;
  };
}

export const demanderPaiement = async (
  payload: DemandePaiementPayload,
): Promise<DemandePaiementResponse> => {
  const response = await axios.post<DemandePaiementResponse>(
    "/api/demande-paiement",
    payload,
  );
  return response.data;
};

export const affichPaiement = async (): Promise<void> => {
  const response = await axios.get<void>("api/demande-paiement");
  return response.data
};
