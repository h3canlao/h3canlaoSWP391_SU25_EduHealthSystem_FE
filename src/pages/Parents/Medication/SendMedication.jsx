import React from 'react';

function useSimpleText(text) {
    return text;
}

export default function SendMedication() {
    const message = useSimpleText('Hello from the hook!');

    return (
        <div>
            {message}
        </div>
    );
}