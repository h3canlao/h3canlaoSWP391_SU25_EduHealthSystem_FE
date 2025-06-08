import React, { useState } from "react";

function useMessage() {
    const [message] = useState("Hello from custom hook!");
    return message;
}

export default function HealthCheckup() {
    const message = useMessage();

    return <div>{message}</div>;
}