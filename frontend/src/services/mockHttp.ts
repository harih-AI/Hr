/**
 * Mock HTTP Service
 * Simulates API calls with a delay using local JSON files.
 */

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockGet = async (url: string) => {
    await delay(800);

    // Normalize URL to file path
    // e.g., /auth/profile -> src/mocks/profile.json
    const path = url.split('/').pop();

    try {
        const response = await fetch(`/src/mocks/${path}.json`);
        if (!response.ok) throw new Error(`Mock data for ${path} not found`);
        return await response.json();
    } catch (error) {
        console.error(`Mock GET Error: ${url}`, error);
        throw error;
    }
};

export const mockPost = async (url: string, data: any) => {
    await delay(1000);
    console.log(`Mock POST to ${url}`, data);

    if (url.includes('/login')) {
        const response = await fetch('/src/mocks/auth.json');
        return await response.json();
    }

    return { success: true };
};

export const mockPut = async (url: string, data: any) => {
    await delay(600);
    console.log(`Mock PUT to ${url}`, data);
    return { success: true };
};

export const mockDelete = async (url: string) => {
    await delay(1000);
    console.log(`Mock DELETE to ${url}`);
    return { success: true };
};
