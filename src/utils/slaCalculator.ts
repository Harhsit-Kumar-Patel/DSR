// Real-Time SLA Calculation Utilities and Formatting

export interface SLAInfo {
  receivedTimestamp: string;
  startTimestamp: string;
  deadlineTimestamp: string;
  currentTimestamp: string;
  isOverdue: boolean;
  status: 'ON TRACK' | 'DUE SOON' | 'OVERDUE' | 'COMPLETED';
  timeRemainingFormatted: string; // e.g. "09d 06h 42m 18s"
  daysRemaining: number;
  hoursRemaining: number;
  minutesRemaining: number;
  secondsRemaining: number;
  overdueDurationFormatted?: string; // e.g. "02d 04h 12m 05s overdue"
  totalDurationHours: number;
  elapsedHours: number;
  percentageElapsed: number;
}

function isValidDate(d: any): boolean {
  return d instanceof Date && !isNaN(d.getTime());
}

/**
 * Calculates real-time SLA metrics from a deadline timestamp against current time
 */
export function calculateRealtimeSLA(
  deadlineTimestamp?: string,
  startTimestamp?: string,
  receivedTimestamp?: string,
  isCaseCompleted: boolean = false
): SLAInfo {
  const now = new Date();
  
  // Safe deadline parse
  let deadline = deadlineTimestamp ? new Date(deadlineTimestamp) : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  if (!isValidDate(deadline)) {
    deadline = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  }

  // Safe start parse
  let start = startTimestamp ? new Date(startTimestamp) : new Date(deadline.getTime() - 30 * 24 * 60 * 60 * 1000);
  if (!isValidDate(start)) {
    start = new Date(deadline.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  // Safe received parse
  let received = receivedTimestamp ? new Date(receivedTimestamp) : start;
  if (!isValidDate(received)) {
    received = start;
  }

  if (isCaseCompleted) {
    return {
      receivedTimestamp: received.toISOString(),
      startTimestamp: start.toISOString(),
      deadlineTimestamp: deadline.toISOString(),
      currentTimestamp: now.toISOString(),
      isOverdue: false,
      status: 'COMPLETED',
      timeRemainingFormatted: 'Completed within SLA',
      daysRemaining: 0,
      hoursRemaining: 0,
      minutesRemaining: 0,
      secondsRemaining: 0,
      totalDurationHours: Math.max(1, (deadline.getTime() - start.getTime()) / (1000 * 60 * 60)),
      elapsedHours: (deadline.getTime() - start.getTime()) / (1000 * 60 * 60),
      percentageElapsed: 100
    };
  }

  const diffMs = deadline.getTime() - now.getTime();
  const totalMs = Math.max(1000, deadline.getTime() - start.getTime());
  const elapsedMs = Math.max(0, now.getTime() - start.getTime());
  const percentageElapsed = Math.min(100, Math.max(0, Math.round((elapsedMs / totalMs) * 100)));

  if (diffMs <= 0) {
    // Overdue
    const absDiffMs = Math.abs(diffMs);
    const overdueDays = Math.floor(absDiffMs / (1000 * 60 * 60 * 24));
    const overdueHours = Math.floor((absDiffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const overdueMins = Math.floor((absDiffMs % (1000 * 60 * 60)) / (1000 * 60));
    const overdueSecs = Math.floor((absDiffMs % (1000 * 60)) / 1000);

    const pad = (n: number) => n.toString().padStart(2, '0');
    const overdueDurationFormatted = `${pad(overdueDays)}d ${pad(overdueHours)}h ${pad(overdueMins)}m ${pad(overdueSecs)}s overdue`;

    return {
      receivedTimestamp: received.toISOString(),
      startTimestamp: start.toISOString(),
      deadlineTimestamp: deadline.toISOString(),
      currentTimestamp: now.toISOString(),
      isOverdue: true,
      status: 'OVERDUE',
      timeRemainingFormatted: overdueDurationFormatted,
      daysRemaining: 0,
      hoursRemaining: 0,
      minutesRemaining: 0,
      secondsRemaining: 0,
      overdueDurationFormatted,
      totalDurationHours: totalMs / (1000 * 60 * 60),
      elapsedHours: elapsedMs / (1000 * 60 * 60),
      percentageElapsed: 100
    };
  }

  // Not overdue
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diffMs % (1000 * 60)) / 1000);

  const pad = (n: number) => n.toString().padStart(2, '0');
  const timeRemainingFormatted = `${pad(days)}d ${pad(hours)}h ${pad(mins)}m ${pad(secs)}s`;

  // Status is DUE SOON if 3 days or fewer remaining
  const status: 'ON TRACK' | 'DUE SOON' = days <= 3 ? 'DUE SOON' : 'ON TRACK';

  return {
    receivedTimestamp: received.toISOString(),
    startTimestamp: start.toISOString(),
    deadlineTimestamp: deadline.toISOString(),
    currentTimestamp: now.toISOString(),
    isOverdue: false,
    status,
    timeRemainingFormatted,
    daysRemaining: days,
    hoursRemaining: hours,
    minutesRemaining: mins,
    secondsRemaining: secs,
    totalDurationHours: totalMs / (1000 * 60 * 60),
    elapsedHours: elapsedMs / (1000 * 60 * 60),
    percentageElapsed
  };
}

/**
 * Generates ISO target timestamp given duration in days from now
 */
export function generateDeadlineDate(daysFromNow: number): string {
  const target = new Date();
  target.setDate(target.getDate() + daysFromNow);
  target.setHours(23, 59, 59, 999);
  return target.toISOString();
}

/**
 * Format timestamp safely into date & time string
 */
export function formatSlaDate(isoString?: string): string {
  if (!isoString) return 'Pending Deadline';
  try {
    const d = new Date(isoString);
    if (!isValidDate(d)) return isoString;
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return isoString;
  }
}
