export async function saveJourneyAPI(data: {
  date: string;
  startTime: string;
  endTime: string;
  distance: number;
  mode: string;
}): Promise<void> {
  const response = await fetch('/api/saveJourney', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to save journey');
  }
}