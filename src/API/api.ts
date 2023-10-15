import * as I from './interfaces';
import axios, { AxiosRequestConfig } from 'axios';

import utils from '../config.json';

const apiUrl = 'http://localhost:3149/clashofclans?url=';
const apiKey = utils.API_KEY;

export async function ApiV1(url: string, method: string, body?: any) {
    const requestOptions: AxiosRequestConfig = {
        method,
        baseURL: apiUrl,
        url,
        headers: {
            'Authorization': `Bearer ${apiKey}`
        }
    }

    if (method === 'GET') {
        try {
            const response = await axios(requestOptions);
            return response.data;
        } catch (error) {
            throw error;
        }
    } 
}

const api = {
    clanwar: {
        get: async (id: string): Promise<I.ClanWarData> => ApiV1(`clans/${encodeURIComponent(id)}/currentwar`, 'GET')
    }
}

export default api;