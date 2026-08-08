import axios from "axios";

// Interface pour la création d'un utilisateur (Payload)
export interface UserPayload {
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  idSite: number;
  idRole: number;
}

// Interface pour l'affichage / la modification
export interface UserData {
  idUser: number;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  designSite: string;
  designRole: string;
  idSite: number;
  idRole: number;
}

// Interface pour la réponse de l'API GET /api/users
interface GetUsersResponse {
  users: UserData[];
}

export const createUser = async (payload: UserPayload): Promise<UserData> => {
  const response = await axios.post<UserData>("/api/users", payload);
  return response.data;
};

export const getUsers = async (): Promise<UserData[]> => {
  const response = await axios.get<GetUsersResponse>("/api/users");
  return response.data.users;
};

export const modifUser = async (user: UserData): Promise<void> => {
  await axios.put(`/api/users/${user.idUser}`, {
    nom: user.nom,
    prenom: user.prenom,
    telephone: user.telephone,
    email: user.email,
    idSite: user.idSite,
    idRole: user.idRole,
  });
};

export const suppriUser = async (idUser: number): Promise<void> => {
  await axios.delete(`/api/users/${idUser}`);
};
