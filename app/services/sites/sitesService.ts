import axios from "axios";


export interface SitePayload{
    designation: string
}

export interface SiteData{
    idSite: number;
    designation: string;
}

interface GetSiteData{
    site: SiteData[]
}

export const getSites = async (): Promise<SiteData[]> =>{
    const response = await axios.get<GetSiteData>('/api/sites');
    return response.data.site
}