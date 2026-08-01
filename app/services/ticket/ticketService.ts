import axios from "axios";

export interface ticketData{
    codeTicket : string;
    dateCreation : string;
    dateExpiration: string;
    statut: string
}

export const createTicket = async (): Promise<ticketData> => {
  const response = await axios.post<ticketData>('/api/tarif');
  return response.data;
};