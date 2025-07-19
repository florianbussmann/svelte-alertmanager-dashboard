import type { PageServerLoad } from './$types';
import dotenv from 'dotenv';
dotenv.config();

export const prerender = false;

export const load: PageServerLoad = async ({ depends }) => {
    depends('am:status');

    const baseUrl = process.env.ALERTMANAGER_URL;

    try {
        const res = await fetch(`${baseUrl}/api/v2/status`);

        if (!res.ok) {
            throw new Error(`Failed to fetch: ${res.status}`);
        }

        const json = await res.json();
        return {
            alertmanagerUrl: baseUrl,
            statusData: json,
            refreshedAt: new Date().toISOString(),
        };
    } catch (err) {
        return {
            alertmanagerUrl: baseUrl,
            statusData: null,
            refreshedAt: new Date().toISOString(),
            error: (err as any).message,
        };
    }
};
