import { useState, useEffect } from 'react';
import { useOSSettings } from '../context/OSSettingsContext';

export default function useClock() {
  const { settings } = useOSSettings();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    const offsetTime = new Date(time.getTime() + Number(settings.timeOffset || 0) * 60 * 60 * 1000);
    let hours = offsetTime.getHours();
    const minutes = String(offsetTime.getMinutes()).padStart(2, '0');
    if (settings.clockFormat === '12') {
      const suffix = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      return `${hours}:${minutes} ${suffix}`;
    }
    hours = String(hours).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatDate = () => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const offsetTime = new Date(time.getTime() + Number(settings.timeOffset || 0) * 60 * 60 * 1000);
    const month = monthNames[offsetTime.getMonth()];
    const day = String(offsetTime.getDate()).padStart(2, '0');
    return `${month} ${day}`;
  };

  return {
    time,
    formattedTime: formatTime(),
    formattedDate: formatDate(),
  };
}
