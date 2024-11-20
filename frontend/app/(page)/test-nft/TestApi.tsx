'use client';

import { useState } from 'react';

export default function TestAPI() {
    const [response, setResponse] = useState(null);

    const testAPI = async () => {
        const data = {
            message: "Votre message signé ici",
            signature: "Votre signature ici",
            address: "0xVotreAdresseIci",
            tokenId: 1
        };

        try {
            const res = await fetch('/api/verify-access', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await res.json();
            setResponse(result);
        } catch (error) {
            console.error('Error calling API:', error);
        }
    };

    return (
        <div>
            <button onClick={testAPI}>Test API</button>
            {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
        </div>
    );
}
