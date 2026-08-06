import axios from "axios";

export interface SitePayload {
  designSite: string;
  localisation: string;
  equipement: string;
  statut: string;
  idVille: number;
}

export interface SiteData {
  idSite: number;
  designSite: string;
  localisation: string;
  equipement: string;
  statut: string;
  idVille: number;
}

interface GetSiteData {
  sites: SiteData[];
}

export const createSite = async (payload: SitePayload): Promise<SiteData> => {
  const response = await axios.post<SiteData>("/api/sites", payload);
  return response.data;
};

export const getSites = async (): Promise<SiteData[]> => {
  const response = await axios.get<GetSiteData>("/api/sites");
  return response.data.sites;
};

export const modifSite = async (site: SiteData): Promise<void> => {
  await axios.put(`/api/sites/${site.idSite}`, {
    designSite: site.designSite,
    localisation: site.localisation,
    equipement: site.equipement,
    statut: site.statut,
    idVille: site.idVille,
  });
};

export const supprSite = async (idSite: number): Promise<void> => {
  await axios.delete(`/api/sites/${idSite}`);
};
