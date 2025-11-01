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

// Helper functions to safely get metadata values
export function getProjectMetadata(metadata: unknown): ProjectMetadata {
  if (typeof metadata === 'object' && metadata !== null) {
    return metadata as ProjectMetadata
  }
  return {}
}

export function getBillableHoursMetadata(metadata: unknown): BillableHoursMetadata {
  if (typeof metadata === 'object' && metadata !== null) {
    return metadata as BillableHoursMetadata
  }
  return {}
}

export function getSurveyMetadata(metadata: unknown): SurveyMetadata {
  if (typeof metadata === 'object' && metadata !== null) {
    return metadata as SurveyMetadata
  }
  return {}
}

export function getTimeTrackingMetadata(metadata: unknown): TimeTrackingMetadata {
  if (typeof metadata === 'object' && metadata !== null) {
    return metadata as TimeTrackingMetadata
  }
  return {}
}
