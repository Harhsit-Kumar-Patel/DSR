import { useState, useEffect } from 'react';
import { calculateRealtimeSLA, SLAInfo } from '../utils/slaCalculator';

/**
 * Custom React hook that recalculates SLA metrics every second
 */
export function useRealtimeSLA(
  deadlineTimestamp: string,
  startTimestamp?: string,
  receivedTimestamp?: string,
  isCaseCompleted: boolean = false
): SLAInfo {
  const [slaInfo, setSlaInfo] = useState<SLAInfo>(() =>
    calculateRealtimeSLA(deadlineTimestamp, startTimestamp, receivedTimestamp, isCaseCompleted)
  );

  useEffect(() => {
    // Initial calculate
    setSlaInfo(calculateRealtimeSLA(deadlineTimestamp, startTimestamp, receivedTimestamp, isCaseCompleted));

    if (isCaseCompleted) return;

    // 1-second interval live tick
    const interval = setInterval(() => {
      setSlaInfo(calculateRealtimeSLA(deadlineTimestamp, startTimestamp, receivedTimestamp, isCaseCompleted));
    }, 1000);

    return () => clearInterval(interval);
  }, [deadlineTimestamp, startTimestamp, receivedTimestamp, isCaseCompleted]);

  return slaInfo;
}
