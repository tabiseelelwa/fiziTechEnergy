import axios from "axios";


export interface RolePayload{
    designation: string
}

export interface RoleData{
    idRole: number;
    designation: string;
}

interface GetRoleData{
    role: RoleData[]
}

export const getRoles = async (): Promise<RoleData[]> =>{
    const response = await axios.get<GetRoleData>('/api/roles');
    return response.data.role
}