import axios from "axios";

export interface VentePayload {
  telephone: string;
  codeTypeForfait: number;
  operateur: string;
  nomClient?: string;
}

export interface VenteData {
  idPaiement: number;
  idClient: number;
  codeTypeTorfait: number;
  montantPaye: number;
  datePaiement: string;
  telephone: string;
  codeTypeForfait: number;
  operateur: string;
  nomClient: string;
}

export interface VenteResponse {
  success: boolean;
  message: string;
  ticket: {
    code: string;
    expiration: string;
    forfait: string;
  };
}

export const createVente = async (
  payload: VentePayload,
): Promise<VenteResponse> => {
  const response = await axios.post<VenteResponse>("/api/vente", payload);
  return response.data;
};

export const affichPaiement = async (): Promise<VenteData[]> => {
  const response = await axios.get<VenteData[]>("/api/vente");
  return response.data;
};
