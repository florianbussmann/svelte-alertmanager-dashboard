import type { PageServerLoad } from './$types';
import dotenv from 'dotenv';
dotenv.config();

let alertCache = new Map<string, any>();

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

        let currentAlerts = [];
        // Fetch alerts only if status is "ready"
        if (clusterStatus === 'ready') {
            try {
                const alertsRes = await fetch(`${baseUrl}/api/v2/alerts`, {
                    headers: { 'Cache-Control': 'no-cache' }
                });
                const alertsJson = await alertsRes.json();
                currentAlerts = alertsJson ?? [];
            } catch (err) {
                console.error('Failed to fetch alerts:', err);
            }
        }

        const activeIds = new Set<string>();
        for (const alert of currentAlerts) {
            const id = `${alert.labels.alertname}-${alert.startsAt}`;
            activeIds.add(id);
            alertCache.set(id, { ...alert });
        }

        // Mark previously seen alerts as resolved if they disappeared
        for (const [id, alert] of alertCache) {
            if (!activeIds.has(id)) {
                alertCache.set(id, { ...alert, status: { state: "resolved" } });
            }
        }

        const cachedAlerts = Array.from(alertCache.values());

        return {
            alertmanagerUrl: baseUrl,
            clusterStatus: clusterStatus,
            statusData: statusJson,
            alerts: cachedAlerts,
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
