import { Headers } from 'node-fetch';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

function parseResponse(responseBody: string): { key: string; value: any }[] {
    // Parse the JSON string into an object
    const data = JSON.parse(responseBody);

    // Check if 'rows' is present and not empty
    if (data.result.rows && data.result.rows.length > 0) {
        // Get the first row (assuming you only need data from the first row)
        const firstRow = data.result.rows[0];

        // Map the desired properties to key-value pairs
        return [
            { key: 'current_lxp', value: firstRow.current_lxp ?? 0 },
            { key: 'fname', value: firstRow.fname ?? 'Not found' },
            { key: 'L14D_active_tier', value: firstRow.L14D_active_tier ?? '-' },
            { key: 'top_engagers', value: (firstRow.top_engagers?.join(', ') ?? '-') },
            { key: 'top_channels', value: (firstRow.top_channels?.join(', ') ?? '-') },
            { key: 'days_old_onchain', value: firstRow.days_old_onchain ?? '-' },
            { key: 'num_onchain_txns', value: firstRow.num_onchain_txns ?? '-' },
            { key: 'contracts_deployed', value: firstRow.contracts_deployed ?? '-' }
        ];
        
    } else {
        // Return an empty array if no rows were found
        return [];
    }
}

export async function getLXPByFID(fid: number) {
    const meta = {
        "x-dune-api-key": process.env.DUNE_API_KEY || ""
    };
    const header = new Headers(meta);
    const url = `https://api.dune.com/api/v1/points/linea/lxp?&filters=fid=${fid}`;
    const requestOptions = {
        method: 'GET',
        headers: header,
    };

    console.log(`Fetching lxp stats for fid: ${fid}`);
    
    const maxRetries = 10;
    let attempts = 0;

    while (attempts <= maxRetries) {
        try {
            const response = await fetch(url, requestOptions);
            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const body = await response.text();
            const result = parseResponse(body);
            console.log(result);
            return result; 
        } catch (error) {
            console.error(`Attempt ${attempts + 1}: Unable to fetch data - ${error}`);
            attempts++;
            if (attempts > maxRetries) {
                throw new Error(`Failed to fetch data after ${maxRetries} attempts`);
            }
        }
    }
}


export async function getLXPByWallet(wallet: string) {
    const meta = {
        "x-dune-api-key": process.env.DUNE_API_KEY || ""
    };
    const header = new Headers(meta);
    const url = `https://api.dune.com/api/v1/points/linea/lxp?&filters=wallet=${wallet}`;
    const requestOptions = {
        method: 'GET',
        headers: header,
    };

    console.log(`Fetching lxp stats for wallet: ${wallet}`);

    const maxRetries = 5;
    let attempts = 0;

    while (attempts <= maxRetries) {
        try {
            const response = await fetch(url, requestOptions);
            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const body = await response.text();
            const result = parseResponse(body);
            console.log(result);
            return result; 
        } catch (error) {
            console.error(`Attempt ${attempts + 1}: Unable to fetch data for wallet - ${error}`);
            attempts++;
            if (attempts > maxRetries) {
                throw new Error(`Failed to fetch data after ${maxRetries} attempts`);
            }
        }
    }
}


export async function getLXPRandomly() {
    // List of URLs to fetch from randomly
    const urls = [
        `https://api.dune.com/api/v1/points/linea/lxp?limit=1&sort_by=current_lxp desc&filters=on_farcaster=true`,
        `https://api.dune.com/api/v1/points/linea/lxp?limit=1&sort_by=current_lxp desc&filters=on_farcaster=true and L14D_active_tier!='npc' and L14D_active_tier!='not active'`,
        `https://api.dune.com/api/v1/points/linea/lxp?limit=1&sort_by=num_followers desc&filters=on_farcaster=true and L14D_active_tier!='npc'`,
        `https://api.dune.com/api/v1/points/linea/lxp?limit=1&sort_by=nft_volume_usd desc&filters=on_farcaster=true and L14D_active_tier!='npc'`,
        `https://api.dune.com/api/v1/points/linea/lxp?limit=1&sort_by=contracts_deployed desc&filters=on_farcaster=true and L14D_active_tier!='npc' and L14D_active_tier!='not active'`,
        `https://api.dune.com/api/v1/points/linea/lxp?limit=1&sort_by=num_onchain_txns desc&filters=on_farcaster=true and L14D_active_tier!='npc' and L14D_active_tier!='not active'`
    ];

    const meta = {
        "x-dune-api-key": process.env.DUNE_API_KEY || ""
    };

    const header = new Headers(meta);

    const maxRetries = 10;
    let attempts = 0;

    while (attempts <= maxRetries) {
        const randomUrl = urls[Math.floor(Math.random() * urls.length)];
        console.log("Fetching lxp stats randomly");

        try {
            const response = await fetch(randomUrl, {
                method: 'GET',
                headers: header,
            });

            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const body = await response.text();
            const result = parseResponse(body);
            console.log(result);
            return result;  
        } catch (error) {
            console.error(`Attempt ${attempts + 1}: Unable to fetch data - ${error}`);
            attempts++;
            if (attempts > maxRetries) {
                throw new Error(`Failed to fetch data after ${maxRetries} attempts`);
            }
        }
    }
}