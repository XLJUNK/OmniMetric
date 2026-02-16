import { getSignalData } from './frontend/lib/signal';

async function test() {
    console.log("Testing getSignalData()...");
    const data = await getSignalData();
    if (data && data.last_updated) {
        console.log("SUCCESS: Data retrieved successfully.");
        console.log("Last updated:", data.last_updated);
        console.log("GMS Score:", data.gms_score);
    } else {
        console.error("FAILURE: Data retrieval failed or returned invalid data.");
    }
}

test();
