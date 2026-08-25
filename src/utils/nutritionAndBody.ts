/**
 * Gym Companion — Calculation Utils for Body, Nutrition & Macros
 * Mifflin-St Jeor TMB, TDEE, IMC & Macro Distribution
 */

import { UserBodyConfig, UserNutritionConfig } from '../types';

export interface BMICalculation {
  bmi: number;
  classification: string;
  colorClass: string;
}

export function calculateAge(birthDateStr?: string): number {
  if (!birthDateStr) return 28;
  const birthDate = new Date(birthDateStr);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return Math.max(1, age);
}

export function calculateBMI(weightKg: number, heightCm: number): BMICalculation {
  if (!weightKg || !heightCm || heightCm <= 0) {
    return { bmi: 0, classification: 'Dados insuficientes', colorClass: 'text-slate-400' };
  }
  const heightM = heightCm / 100;
  const bmi = Math.round((weightKg / (heightM * heightM)) * 10) / 10;

  let classification = 'Peso Normal';
  let colorClass = 'text-emerald-500';

  if (bmi < 18.5) {
    classification = 'Abaixo do Peso';
    colorClass = 'text-amber-400';
  } else if (bmi >= 18.5 && bmi < 25) {
    classification = 'Peso Normal (Eutrófico)';
    colorClass = 'text-emerald-400';
  } else if (bmi >= 25 && bmi < 30) {
    classification = 'Sobrepeso';
    colorClass = 'text-amber-400';
  } else if (bmi >= 30 && bmi < 35) {
    classification = 'Obesidade Grau I';
    colorClass = 'text-orange-500';
  } else if (bmi >= 35 && bmi < 40) {
    classification = 'Obesidade Grau II';
    colorClass = 'text-rose-500';
  } else {
    classification = 'Obesidade Grau III (Mórbida)';
    colorClass = 'text-red-600';
  }

  return { bmi, classification, colorClass };
}

/**
 * Mifflin-St Jeor Equation for Basal Metabolic Rate (TMB / BMR)
 * Male: 10 * weight + 6.25 * height - 5 * age + 5
 * Female: 10 * weight + 6.25 * height - 5 * age - 161
 * Neutral: 10 * weight + 6.25 * height - 5 * age - 78
 */
export function calculateTMB(weightKg: number, heightCm: number, age: number, gender: 'M' | 'F' | 'Outro'): number {
  if (!weightKg || !heightCm || !age) return 0;
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (gender === 'M') return Math.round(base + 5);
  if (gender === 'F') return Math.round(base - 161);
  return Math.round(base - 78);
}

/**
 * Total Daily Energy Expenditure (TDEE)
 */
export function calculateTDEE(tmb: number, activityFactor: number = 1.55): number {
  return Math.round(tmb * activityFactor);
}

export interface MacroBreakdown {
  targetCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams: number;
  waterLiters: number;
}

export function calculateMacros(
  bodyConfig: UserBodyConfig,
  nutritionConfig?: UserNutritionConfig
): MacroBreakdown {
  const age = bodyConfig.age || 28;
  const tmb = calculateTMB(bodyConfig.weightKg, bodyConfig.heightCm, age, bodyConfig.gender);
  const factor = nutritionConfig?.activityFactor || 1.55;
  const tdee = calculateTDEE(tmb, factor);

  const goal = nutritionConfig?.targetGoal || 'Ganho de Massa';
  let offset = nutritionConfig?.customCalorieOffset ?? 0;
  if (offset === 0) {
    if (goal === 'Perda de Gordura') offset = -400;
    else if (goal === 'Ganho de Massa') offset = 350;
    else offset = 0;
  }

  const targetCalories = Math.max(1200, tdee + offset);

  // Protein calculation
  const proteinPerKg = nutritionConfig?.proteinGramsPerKg || 2.0;
  const proteinGrams = nutritionConfig?.customProteinGrams ?? Math.round(bodyConfig.weightKg * proteinPerKg);

  // Fat calculation (e.g., 25% of calories)
  const fatPercent = nutritionConfig?.fatPercentOfCalories || 25;
  const fatCalories = targetCalories * (fatPercent / 100);
  const fatGrams = nutritionConfig?.customFatGrams ?? Math.round(fatCalories / 9);

  // Carbs calculation (remaining calories)
  const proteinCalories = proteinGrams * 4;
  const remainingCalories = Math.max(0, targetCalories - (proteinCalories + fatGrams * 9));
  const carbsGrams = nutritionConfig?.customCarbsGrams ?? Math.round(remainingCalories / 4);

  // Fiber calculation (14g per 1000 kcal)
  const fiberGrams = nutritionConfig?.customFiberGrams ?? Math.round((targetCalories / 1000) * 14);

  // Water intake calculation (35ml per kg)
  const waterLiters = nutritionConfig?.customWaterLiters ?? Math.round(bodyConfig.weightKg * 0.035 * 10) / 10;

  return {
    targetCalories,
    proteinGrams,
    carbsGrams,
    fatGrams,
    fiberGrams,
    waterLiters,
  };
}
