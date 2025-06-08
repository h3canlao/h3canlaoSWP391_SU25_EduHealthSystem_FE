import React from 'react';

function useSimpleMessage() {
    return "Hello from the hook!";
}

const Notifications = () => {
    const message = useSimpleMessage();

    return (
        <div>
            {message}
        </div>
    );
};

export default Notifications;