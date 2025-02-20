import React, { useState, useRef } from 'react';
import { haversineDistance } from '../../utils/distance';
import { saveJourneyAPI } from '../../api/journey';

const JourneyTracker = () => {
  const [tracking, setTracking] = useState(false);
  const [distance, setDistance] = useState(0);
  const [mode, setMode] = useState('bike');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const lastPosition = useRef<{ latitude: number; longitude: number } | null>(null);
  const [saving, setSaving] = useState(false);

  const startTracking = () => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser.');
      return;
    }
    setTracking(true);
    setDistance(0);
    setStartTime(new Date());
    lastPosition.current = null;
    const id = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (lastPosition.current) {
          const d = haversineDistance(
            lastPosition.current.latitude,
            lastPosition.current.longitude,
            latitude,
            longitude
          );
          setDistance((prev) => prev + d);
          console.log('Distance updated:', distance + d);
        }
        lastPosition.current = { latitude, longitude };
      },
      (error) => {
        console.error('Geolocation error:', error);
      },
      { enableHighAccuracy: true }
    );
    setWatchId(id);
  };

  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setTracking(false);
    setEndTime(new Date());
  };

  const saveJourney = async () => {
    if (!startTime || !endTime) {
      console.error('Tracking has not completed properly.');
      return;
    }
    setSaving(true);
    try {
      const data = {
        date: new Date().toISOString().split('T')[0],
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        distance,
        mode,
      };
      await saveJourneyAPI(data);
      console.log('Journey saved successfully');
      setDistance(0);
      setStartTime(null);
      setEndTime(null);
      lastPosition.current = null;
    } catch (error) {
      console.error('Error saving journey:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Journey Tracker</h2>
      <div className="flex items-center mb-4">
        <label className="mr-4">
          <input
            type="radio"
            name="mode"
            value="bike"
            checked={mode === 'bike'}
            onChange={() => setMode('bike')}
            className="box-border mr-1 cursor-pointer"
          />
          Bike
        </label>
        <label>
          <input
            type="radio"
            name="mode"
            value="vehicle"
            checked={mode === 'vehicle'}
            onChange={() => setMode('vehicle')}
            className="box-border mr-1 cursor-pointer"
          />
          Vehicle
        </label>
      </div>
      <div className="mb-4">
        <p className="text-lg">Distance: {distance.toFixed(2)} km</p>
      </div>
      <div className="flex gap-4">
        {!tracking && (
          <button
            onClick={startTracking}
            className="cursor-pointer bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Start Tracking
          </button>
        )}
        {tracking && (
          <button
            onClick={stopTracking}
            className="cursor-pointer bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Stop Tracking
          </button>
        )}
        {!tracking && startTime && endTime && (
          <button
            onClick={saveJourney}
            disabled={saving}
            className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Journey'}
          </button>
        )}
      </div>
    </div>
  );
};

export default JourneyTracker;