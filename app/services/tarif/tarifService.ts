import axios from 'axios';

export interface CreateTarifPayload {
  nom: string;
  prix: number;
  duree: number;
}

export interface TarifData {
  codeTypeForfait: number;
  designation: string;
  dureeMinutes: number;
  prixFC: number;
}

export const createTarif = async (payload: CreateTarifPayload): Promise<TarifData> => {
  const response = await axios.post<TarifData>('/api/tarif', payload);
  return response.data;
};

export const getTarifs = async (): Promise<TarifData[]> => {
  const response = await axios.get<TarifData[]>('/api/tarif');
  return response.data;
};

export const deleteTarif = async (codeTypeForfait: number): Promise<void> => {
  await axios.delete(`/api/tarif/${codeTypeForfait}`);
};

// Fonction pour mettre à jour un tarif
export const updateTarif = async (tarif: TarifData): Promise<void> => {
  await axios.put(`/api/tarif/${tarif.codeTypeForfait}`, {
    designation: tarif.designation,
    dureeMinutes: tarif.dureeMinutes,
    prixFC: tarif.prixFC,
  });
};



