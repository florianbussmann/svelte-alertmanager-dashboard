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

        const statusJson = await res.json();

        const clusterStatus = statusJson.cluster?.status ?? 'down';

        let alerts = [];
        // Fetch alerts only if status is "ready"
        if (clusterStatus === 'ready') {
            try {
                const alertsRes = await fetch(`${baseUrl}/api/v2/alerts`, {
                    headers: { 'Cache-Control': 'no-cache' }
                });
                const alertsJson = await alertsRes.json();
                alerts = alertsJson ?? [];
            } catch (err) {
                console.error('Failed to fetch alerts:', err);
            }
        }
        return {
            alertmanagerUrl: baseUrl,
            clusterStatus: clusterStatus,
            statusData: statusJson,
            alerts: alerts,
            refreshedAt: new Date().toISOString(),
        };
    } catch (err) {
        return {
            alertmanagerUrl: baseUrl,
            clusterStatus: 'error',
            statusData: null,
            alerts: [],
            refreshedAt: new Date().toISOString(),
            error: (err as any).message,
        };
    }
};
