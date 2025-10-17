// Type definitions for Prisma JSON metadata fields

export interface ProjectMetadata {
  serviceTier?: string
  completionTime?: number
  consultant?: string
  projectType?: string
  estimatedDays?: number
  efficiency?: number
}

export interface BillableHoursMetadata {
  hourlyRate?: number
  consultant?: string
  serviceTier?: string
}

export interface SurveyMetadata {
  feedback?: string
  surveyType?: string
}

export interface TimeTrackingMetadata {
  hourlyRate?: number
  consultant?: string
  serviceTier?: string
  projectType?: string
}

// Type guard functions to safely access JSON metadata
export function isProjectMetadata(metadata: unknown): metadata is ProjectMetadata {
  return metadata != null && typeof metadata === 'object' && !Array.isArray(metadata)
}

export function isBillableHoursMetadata(metadata: unknown): metadata is BillableHoursMetadata {
  return metadata != null && typeof metadata === 'object' && !Array.isArray(metadata)
}

export function isSurveyMetadata(metadata: unknown): metadata is SurveyMetadata {
  return metadata != null && typeof metadata === 'object' && !Array.isArray(metadata)
}

export function isTimeTrackingMetadata(metadata: unknown): metadata is TimeTrackingMetadata {
  return metadata != null && typeof metadata === 'object' && !Array.isArray(metadata)
}

// Helper functions to safely get metadata values
export function getProjectMetadata(metadata: unknown): ProjectMetadata {
  return isProjectMetadata(metadata) ? metadata : {}
}

export function getBillableHoursMetadata(metadata: unknown): BillableHoursMetadata {
  return isBillableHoursMetadata(metadata) ? metadata : {}
}

export function getSurveyMetadata(metadata: unknown): SurveyMetadata {
  return isSurveyMetadata(metadata) ? metadata : {}
}

export function getTimeTrackingMetadata(metadata: unknown): TimeTrackingMetadata {
  return isTimeTrackingMetadata(metadata) ? metadata : {}
}
