// Core Data Types for BHUMI-SENTINEL Land Acquisition Platform

export type Role =
  | 'National Admin'
  | 'State Officer'
  | 'District Officer'
  | 'Survey Officer'
  | 'Legal Officer'
  | 'Finance Officer'
  | 'Project Authority';

export type FileStatus =
  | 'SENT'
  | 'RECEIVED'
  | 'UNDER_REVIEW'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'RETURNED'
  | 'FORWARDED'
  | 'COMPLETED';

export type TaskStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'DELAYED'
  | 'BLOCKED'
  | 'REJECTED';

export type StageStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'DELAYED'
  | 'BLOCKED'
  | 'REJECTED';

export type ParcelStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'ACQUIRED'
  | 'DELAYED'
  | 'DISPUTED';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type DocumentStatus =
  | 'MISSING'
  | 'UPLOADED'
  | 'UNDER_VERIFICATION'
  | 'VERIFIED'
  | 'REJECTED';

export type StageName =
  | 'Land Identification'
  | 'Survey'
  | 'Ownership Verification'
  | 'Document Verification'
  | 'Notification'
  | 'Objection Review'
  | 'Valuation'
  | 'Compensation Approval'
  | 'Payment'
  | 'Acquisition'
  | 'Handover';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  designation: string;
  department: string;
  district?: string;
  state?: string;
  avatar?: string;
  phone?: string;
  employeeId?: string;
  dscStatus?: 'ACTIVE' | 'PENDING' | 'EXPIRED';
  jurisdiction?: string;
  joinedDate?: string;
  rating?: number;
}

export interface AcquisitionStage {
  id: string;
  stageNumber: number;
  name: StageName;
  status: StageStatus;
  assignedOfficer: string;
  assignedDepartment: string;
  startDate?: string;
  dueDate: string;
  completedDate?: string;
  delayDays: number;
  delayReason?: string;
  remarks?: string;
}

export interface Task {
  taskId: string;
  taskName: string;
  parcelId: string;
  stageName: StageName;
  assignedOfficer: string;
  department: string;
  status: TaskStatus;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  createdDate: string;
  startDate?: string;
  dueDate: string;
  completedDate?: string;
  delayDays: number;
  delayReason?: string;
  remarks?: string;
}

export interface DocumentMismatch {
  field: string;
  documentValue: string;
  databaseValue: string;
  discrepancy: string;
  severity: 'CRITICAL' | 'WARNING';
}

export interface CaseDocument {
  id: string;
  parcelId: string;
  type:
    | 'Land Record'
    | 'Ownership Proof'
    | 'Survey Report'
    | 'Acquisition Notice'
    | 'Objection Document'
    | 'Valuation Report'
    | 'Compensation Document'
    | 'Payment Receipt'
    | 'Handover Document';
  title: string;
  fileName: string;
  fileSize: string;
  uploadedBy: string;
  uploadedDate: string;
  status: DocumentStatus;
  verifiedBy?: string;
  verifiedDate?: string;
  remarks?: string;
  extractedData?: {
    ownerName?: string;
    khasraNumber?: string;
    areaHa?: number;
    village?: string;
    district?: string;
    docDate?: string;
    surveyNo?: string;
  };
  mismatches?: DocumentMismatch[];
}

export interface FileMovementStep {
  stepId: string;
  fromOfficer: string;
  fromDepartment: string;
  toOfficer: string;
  toDepartment: string;
  timestamp: string;
  status: FileStatus;
  purpose: string;
  remarks?: string;
  returnReason?: string;
  requiredCorrection?: string;
  dueDate?: string;
}

export interface DigitalFile {
  fileId: string;
  parcelId: string;
  project: string;
  currentStage: StageName;
  currentOfficer: string;
  currentDepartment: string;
  previousOfficer?: string;
  previousDepartment?: string;
  status: FileStatus;
  receivedDate: string;
  dueDate: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  risk: RiskLevel;
  requiredCorrection?: string;
  returnReasonCategory?: string;
  returnRemarks?: string;
  movementHistory: FileMovementStep[];
}

export interface ParcelDispute {
  disputeId: string;
  parcelId: string;
  petitioner: string;
  courtOrForum: string;
  caseNumber: string;
  filingDate: string;
  status: 'ACTIVE' | 'HEARING_SCHEDULED' | 'STAY_ORDER' | 'RESOLVED';
  summary: string;
  stayGranted: boolean;
}

export interface CompensationDetails {
  parcelId: string;
  baseRatePerHa: number;
  totalMarketValueLakhs: number;
  solatiumLakhs: number; // 100% solatium as per RFCTLARR 2013
  multiplicationFactor: number;
  totalAwardLakhs: number;
  paymentStatus: 'NOT_INITIATED' | 'APPROVAL_PENDING' | 'APPROVED' | 'DISBURSED' | 'HELD_IN_ESCROW';
  bankReference?: string;
  beneficiaries: Array<{
    name: string;
    sharePercentage: number;
    amountLakhs: number;
    bankAccountMasked: string;
    kycStatus: 'VERIFIED' | 'PENDING' | 'REJECTED';
  }>;
}

export interface Parcel {
  parcelId: string;
  khasraNumber: string;
  district: string;
  tehsil: string;
  village: string;
  project: string;
  projectId: string;
  area: number; // in hectares
  latitude: number;
  longitude: number;
  polygonCoordinates?: [number, number][]; // lat, lng pairs
  status: ParcelStatus;
  currentStage: StageName;
  riskLevel: RiskLevel;
  riskScore: number;
  riskReasons: string[];
  ownerReference: string;
  ownerType: 'Private Individual' | 'Joint Family' | 'Government Land' | 'Gram Panchayat' | 'Trust/Institutional';
  currentOfficer: string;
  currentDepartment: string;
  digitalFileId: string;
  progress: number; // calculated percentage
  delayDays: number;
  delayReason?: string;
  lastUpdated: string;
  stages: AcquisitionStage[];
  dispute?: ParcelDispute;
  compensation?: CompensationDetails;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: Role;
  action: string;
  fileId?: string;
  parcelId?: string;
  previousStatus?: string;
  newStatus?: string;
  remarks: string;
  ipAddress?: string;
}

export interface AppNotification {
  id: string;
  timestamp: string;
  type:
    | 'New File Received'
    | 'File Accepted'
    | 'File Returned'
    | 'Deadline Approaching'
    | 'Task Overdue'
    | 'High Risk Detected'
    | 'Document Mismatch'
    | 'File Forwarded'
    | 'New Officer Onboarded';
  title: string;
  message: string;
  parcelId?: string;
  fileId?: string;
  read: boolean;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface Project {
  projectId: string;
  name: string;
  code: string;
  state: string;
  districts: string[];
  totalAreaHa: number;
  totalParcels: number;
  acquiredParcels: number;
  inProgressParcels: number;
  delayedParcels: number;
  disputedParcels: number;
  budgetCr: number;
  disbursedCr: number;
  startDate: string;
  targetCompletionDate: string;
}

export type LandCategory =
  | 'Agricultural (Irrigated / Chahi)'
  | 'Agricultural (Unirrigated / Barani)'
  | 'Residential Urban'
  | 'Residential Suburban / Rural'
  | 'Commercial (Highway / Main Road)'
  | 'Industrial (RIICO / SEZ Corridor)';

export interface CityLandRate {
  cityName: string;
  tehsil: string;
  category: LandCategory;
  ratePerSqMeter: number; // ₹ per sq.m
  ratePerSqFoot: number; // ₹ per sq.ft (approx ratePerSqMeter / 10.7639)
  ratePerAcre: number; // ₹ per acre (ratePerSqMeter * 4046.86)
  ratePerHectare: number; // ₹ per hectare (ratePerSqMeter * 10000)
  ratePerBigha: number; // ₹ per pucca bigha (ratePerSqMeter * 2529.28)
  ratePerGaj: number; // ₹ per gaj (ratePerSqMeter / 1.196)
  marketRateMultiplier: number; // e.g. 1.35x of DLC
  lastUpdated: string;
  dlcNotificationNo: string;
}

export interface DistrictLandRateData {
  district: string;
  state: string;
  headquarters: string;
  avgAgriculturePerAcreLakhs: number;
  avgCommercialPerSqFt: number;
  avgResidentialPerSqFt: number;
  cities: CityLandRate[];
  rfctlarrRuralMultiplier: number; // 1.0 to 2.0 based on distance from urban area
}
