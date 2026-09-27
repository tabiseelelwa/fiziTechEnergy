import axios from "axios";

export interface Depense {
  idDepense: number;
  montantDepense: number | string;
  dateDepense: string;
  descriptMotif: string;
  nom: string;
}

export interface DepensePayload {
  montantDepense: number;
  idMotifDepense: number;
}

export interface FetchDepensesParams {
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface MotifDepense {
  idMotifDepense: number;
  descriptMotif: string;
}

export async function fetchDepenses(params: FetchDepensesParams) {
  try {
    const response = await axios.get("/api/depenses/toutes", {
      params: {
        page: params.page,
        limit: params.limit,
        search: params.search || undefined,
        startDate: params.startDate || undefined,
        endDate: params.endDate || undefined,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Erreur lors de la récupération des dépenses");
  }
}

export const createDepense = async (data: DepensePayload) => {
  try {
    const response = await axios.post("/api/depenses", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Erreur lors de la création de la dépense");
  }
};

export const deleteDepense = async (id: number): Promise<void> => {
  await axios.delete(`/api/depenses/toutes/${id}`);
};

export const getMotifsDepense = async (): Promise<MotifDepense[]> => {
  try {
    const response = await axios.get("/api/depenses/motifs-depenses");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Erreur lors de la création de la dépense");
  }
};
