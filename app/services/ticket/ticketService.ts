import axios from "axios";

export interface ticketData{
    codeTicket : string;
    dateCreation : string;
    dateExpiration: string;
    statut: string
}

export interface TicketPayload {
  telephone: string;
  codeTicket: string;
  idSite?: number;
}

export const createTicket = async (): Promise<ticketData> => {
  const response = await axios.post<ticketData>('/api/tarif');
  return response.data;
};



export const validerTicketSecours = async (payload: TicketPayload) => {
  const response = await axios.post("/api/verif-ticket", payload);
  return response.data;
};