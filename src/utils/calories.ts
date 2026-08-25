/**
 * Gym Companion — Smart Caloric & Energy Expenditure Estimator
 * Calculates estimated calories burned based on body weight, height, age, gender, duration, and volume lifted.
 */
import { UserBodyConfig } from '../types';

export function estimateWorkoutCalories(
  bodyConfig: UserBodyConfig,
  durationSeconds: number,
  totalVolumeKg: number,
  averageRpe: number = 8
): number {
  const durationMinutes = Math.max(1, durationSeconds / 60);

  // Base MET (Metabolic Equivalent of Task) for weight training
  // Standard resistance training MET ~ 3.5 to 6.0 depending on intensity & RPE
  let met = 4.5;
  if (averageRpe >= 9) {
    met = 6.0;
  } else if (averageRpe >= 7) {
    met = 5.0;
  } else {
    met = 3.8;
  }

  // Weight lifting volume density factor (extra metabolic demand from high volume)
  // For every 5000 kg lifted, add ~0.5 MET
  const volumeBonusMet = Math.min(1.5, (totalVolumeKg / 5000) * 0.5);
  const totalMet = met + volumeBonusMet;

  // Formula: Calories = MET * weight (kg) * (duration in hours)
  const baseCalories = totalMet * bodyConfig.weightKg * (durationMinutes / 60);

  // Gender & age adjustments
  let ageGenderFactor = 1.0;
  if (bodyConfig.gender === 'M') {
    ageGenderFactor = 1.05;
  } else if (bodyConfig.gender === 'F') {
    ageGenderFactor = 0.95;
  }

  // Older adults slightly lower BMR contribution during workout
  if (bodyConfig.age > 45) {
    ageGenderFactor *= 0.94;
  }

  const result = Math.round(baseCalories * ageGenderFactor);
  return Math.max(15, result);
}

/**
 * Formats seconds into MM:SS or HH:MM:SS
 */
export function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
