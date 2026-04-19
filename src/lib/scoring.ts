import { Company, ScoreBreakdown } from './types';

export function calculateScore(company: Company): ScoreBreakdown {
  // Owner age score (0-30)
  let ownerAge = 0;
  if (company.youngest_owner_age >= 70) ownerAge = 30;
  else if (company.youngest_owner_age >= 65) ownerAge = 25;
  else if (company.youngest_owner_age >= 60) ownerAge = 15;
  else if (company.youngest_owner_age >= 55) ownerAge = 5;

  // Owner-managed (0-20)
  const ownerManaged = company.has_representative_owner ? 20 : 0;

  // No family successor signal (0-15)
  const noFamilySuccessor = !company.is_family_owned ? 15 : 0;

  // Revenue sweet spot for PE acquisition (0-10)
  let revenueSweetSpot = 0;
  const revEur = (company.revenue || 0) / 100;
  if (revEur >= 500_000 && revEur <= 5_000_000) revenueSweetSpot = 10;
  else if (revEur >= 250_000 && revEur <= 10_000_000) revenueSweetSpot = 5;

  // Employee sweet spot (0-10)
  let employeeSweetSpot = 0;
  if (company.employees >= 5 && company.employees <= 80) employeeSweetSpot = 10;
  else if (company.employees >= 1 && company.employees <= 150) employeeSweetSpot = 5;

  // Company age — established businesses > 15 years (0-10)
  let companyAge = 0;
  if (company.incorporated_at) {
    const parts = company.incorporated_at.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[2], 10);
      const currentYear = new Date().getFullYear();
      const age = currentYear - year;
      if (age >= 25) companyAge = 10;
      else if (age >= 15) companyAge = 7;
      else if (age >= 10) companyAge = 4;
    }
  }

  // Sole owner — simpler succession (0-5)
  const soleOwner = company.has_sole_owner ? 5 : 0;

  const total = Math.min(
    ownerAge + ownerManaged + noFamilySuccessor + revenueSweetSpot + employeeSweetSpot + companyAge + soleOwner,
    100
  );

  return {
    total,
    ownerAge,
    ownerManaged,
    noFamilySuccessor,
    revenueSweetSpot,
    employeeSweetSpot,
    companyAge,
    soleOwner,
  };
}

export function getScoreColor(score: number): string {
  if (score >= 75) return '#22c55e'; // green
  if (score >= 55) return '#eab308'; // yellow
  if (score >= 35) return '#c8b48c'; // gold
  return '#6b6b7b'; // grey
}

export function getScoreLabel(score: number): string {
  if (score >= 75) return 'Hoch';
  if (score >= 55) return 'Mittel';
  if (score >= 35) return 'Gering';
  return 'Niedrig';
}
