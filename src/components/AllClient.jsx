import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AllClients() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClients = async () => {
            setLoading(true);
            setError('');

            try {
                const res = await fetch('http://localhost:3000/api/client');

                if (!res.ok) {
                    throw new Error('Failed to fetch clients');
                }

                const data = await res.json();
                setClients(data);
            } catch (err) {
                setError(err.message);
            }

            setLoading(false);
        };

        fetchClients();
    }, []);

    const handleViewClient = (clientId) => {
        navigate('/receivedclientamount', { state: { clientId } });
    };

    // New handler to navigate to receive amount page
    const handleReceiveAmount = (clientId) => {
        navigate('/sendclientamount', { state: { clientId } });
    };

    return (
        <div className="max-w-2xl mx-auto mt-6 p-6 bg-white shadow rounded">
            <h2 className="text-xl font-bold text-blue-600 mb-4 text-center">All Clients</h2>

            {loading && <p className="text-center">Loading clients...</p>}
            {error && <p className="text-center text-red-600">{error}</p>}

            {!loading && !error && clients.length === 0 && (
                <p className="text-center text-gray-500">No clients found.</p>
            )}

            {!loading && !error && clients.length > 0 && (
                <ul className="space-y-3">
                    {clients.map((client) => (
                        <li
                            key={client._id}
                            className="border border-gray-300 rounded p-3 flex flex-col space-y-1"
                        >
                            <span className="font-semibold text-gray-700">Name: {client.name}</span>
                            <span className="text-gray-600">Phone: {client.phoneNumber}</span>
                            <span className="text-gray-600">Address: {client.address}</span>
                            <span className="text-gray-600">ID: {client._id}</span>

                            <div className="flex space-x-2 mt-2">
                                <button
                                    onClick={() => handleViewClient(client._id)}
                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                >
                                    reveived amount
                                </button>

                                <button
                                    onClick={() => handleReceiveAmount(client._id)}
                                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                >
                                    send amount
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
