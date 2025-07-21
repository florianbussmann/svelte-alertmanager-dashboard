
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Alert = {
    fingerprint: string;
    annotations: {
        summary: string;
        description: string;
    }
    labels: {
        alertname: string;
        instance: string;
        severity: string;
    };
    status: {
        state: string;
    };
    startsAt: string;
    updatedAt: string;
};