import React, { useEffect, useState } from 'react';

interface Journey {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  distance: number;
  mode: string;
}

const History = () => {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchJourneys = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/getJourneys', {
        headers: {
          'Content-Type': 'application/json'
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch journeys');
      }
      const data = await response.json();
      setJourneys(data);
      console.log('Journeys fetched:', data);
    } catch (error) {
      console.error('Error fetching journeys:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJourneys();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Journey History</h2>
      {loading ? (
        <p>Loading...</p>
      ) : journeys.length === 0 ? (
        <p>No journeys recorded.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border p-2">Date</th>
              <th className="border p-2">Start Time</th>
              <th className="border p-2">End Time</th>
              <th className="border p-2">Distance (km)</th>
              <th className="border p-2">Mode</th>
            </tr>
          </thead>
          <tbody>
            {journeys.map((journey) => (
              <tr key={journey.id}>
                <td className="border p-2">{journey.date}</td>
                <td className="border p-2">{new Date(journey.startTime).toLocaleTimeString()}</td>
                <td className="border p-2">{new Date(journey.endTime).toLocaleTimeString()}</td>
                <td className="border p-2">{journey.distance.toFixed(2)}</td>
                <td className="border p-2 capitalize">{journey.mode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default History;