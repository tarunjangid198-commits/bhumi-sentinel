import {
  User,
  Project,
  Parcel,
  DigitalFile,
  Task,
  CaseDocument,
  AuditLog,
  AppNotification,
  StageName,
} from '../types';

export const DEMO_USERS: User[] = [
  {
    id: 'USR-01',
    name: 'Rajesh Verma',
    email: 'admin@bhumi.demo',
    role: 'National Admin',
    designation: 'Director General (Land Resources)',
    department: 'Ministry of Rural Development',
    state: 'National',
  },
  {
    id: 'USR-02',
    name: 'Sunita Choudhary, IAS',
    email: 'state@bhumi.demo',
    role: 'State Officer',
    designation: 'Principal Secretary (Revenue)',
    department: 'State Revenue Department',
    state: 'Rajasthan',
  },
  {
    id: 'USR-03',
    name: 'Ashok Kumar Meena, RAS',
    email: 'district@bhumi.demo',
    role: 'District Officer',
    designation: 'Additional District Magistrate / Land Acquisition Officer',
    department: 'District Revenue Office',
    district: 'Jaipur',
    state: 'Rajasthan',
  },
  {
    id: 'USR-04',
    name: 'Vikram Singh',
    email: 'survey@bhumi.demo',
    role: 'Survey Officer',
    designation: 'Head Cadastral Surveyor',
    department: 'Directorate of Land Records & Survey',
    district: 'Jaipur',
    state: 'Rajasthan',
  },
  {
    id: 'USR-05',
    name: 'Priyanka Rathore',
    email: 'legal@bhumi.demo',
    role: 'Legal Officer',
    designation: 'Senior Legal Officer & Dispute Arbiter',
    department: 'Revenue Legal Cell',
    district: 'Jaipur',
    state: 'Rajasthan',
  },
  {
    id: 'USR-06',
    name: 'R.K. Sharma',
    email: 'finance@bhumi.demo',
    role: 'Finance Officer',
    designation: 'Chief Accounts Officer (Compensation)',
    department: 'District Finance & Treasury',
    district: 'Jaipur',
    state: 'Rajasthan',
  },
  {
    id: 'USR-07',
    name: 'Col. Sanjeev Nair (Retd.)',
    email: 'project@bhumi.demo',
    role: 'Project Authority',
    designation: 'Chief Project Director',
    department: 'National Highway Authority of India (NHAI)',
    district: 'Jaipur Corridor',
    state: 'Rajasthan',
  },
];

export const DEMO_PROJECTS: Project[] = [
  {
    projectId: 'PRJ-101',
    name: 'NHAI Delhi-Mumbai Expressway Corridor (NH-48 Jaipur Bypass)',
    code: 'NHAI-DME-JPR',
    state: 'Rajasthan',
    districts: ['Jaipur', 'Dausa'],
    totalAreaHa: 142.5,
    totalParcels: 38,
    acquiredParcels: 21,
    inProgressParcels: 11,
    delayedParcels: 4,
    disputedParcels: 2,
    budgetCr: 420.0,
    disbursedCr: 268.4,
    startDate: '2025-01-15',
    targetCompletionDate: '2026-12-31',
  },
  {
    projectId: 'PRJ-102',
    name: 'Ministry of Railways - Western Dedicated Freight Corridor (WDFC)',
    code: 'DFCCIL-WDFC-RP',
    state: 'Rajasthan',
    districts: ['Jaipur', 'Alwar', 'Ajmer'],
    totalAreaHa: 285.0,
    totalParcels: 24,
    acquiredParcels: 16,
    inProgressParcels: 5,
    delayedParcels: 2,
    disputedParcels: 1,
    budgetCr: 880.0,
    disbursedCr: 610.5,
    startDate: '2024-06-01',
    targetCompletionDate: '2026-08-30',
  },
  {
    projectId: 'PRJ-103',
    name: 'JMRC Jaipur Metro Phase-2 Extension (Sitapura-Ambaji Industrial Link)',
    code: 'JMRC-M2-SIT',
    state: 'Rajasthan',
    districts: ['Jaipur'],
    totalAreaHa: 48.2,
    totalParcels: 15,
    acquiredParcels: 10,
    inProgressParcels: 3,
    delayedParcels: 1,
    disputedParcels: 1,
    budgetCr: 320.0,
    disbursedCr: 215.0,
    startDate: '2025-03-01',
    targetCompletionDate: '2027-04-15',
  },
  {
    projectId: 'PRJ-104',
    name: 'NHAI Delhi-Vadodara 8-Lane Expressway Spur (Kota Connector)',
    code: 'NHAI-DVE-KOTA',
    state: 'Rajasthan',
    districts: ['Kota', 'Bundi'],
    totalAreaHa: 190.0,
    totalParcels: 12,
    acquiredParcels: 7,
    inProgressParcels: 3,
    delayedParcels: 1,
    disputedParcels: 1,
    budgetCr: 550.0,
    disbursedCr: 340.0,
    startDate: '2024-11-01',
    targetCompletionDate: '2026-10-31',
  },
  {
    projectId: 'PRJ-105',
    name: 'MNRE Rajasthan Ultra Mega Solar Power Park Phase IV (Bhadla-Bikaner)',
    code: 'MNRE-SLR-BB4',
    state: 'Rajasthan',
    districts: ['Jodhpur', 'Bikaner'],
    totalAreaHa: 620.0,
    totalParcels: 10,
    acquiredParcels: 8,
    inProgressParcels: 2,
    delayedParcels: 0,
    disputedParcels: 0,
    budgetCr: 1200.0,
    disbursedCr: 950.0,
    startDate: '2024-04-10',
    targetCompletionDate: '2026-06-30',
  },
  {
    projectId: 'PRJ-106',
    name: 'RIICO Alwar-Bhiwadi Industrial Logistics Corridors (NCR SEZ)',
    code: 'RIICO-BHW-LOG',
    state: 'Rajasthan',
    districts: ['Alwar'],
    totalAreaHa: 110.0,
    totalParcels: 8,
    acquiredParcels: 5,
    inProgressParcels: 2,
    delayedParcels: 1,
    disputedParcels: 0,
    budgetCr: 275.0,
    disbursedCr: 180.0,
    startDate: '2025-02-01',
    targetCompletionDate: '2027-01-31',
  },
  {
    projectId: 'PRJ-107',
    name: 'MoRTH Ajmer-Pushkar Smart Tourist Bypass 4-Lane Highway',
    code: 'MoRTH-AP-BYP',
    state: 'Rajasthan',
    districts: ['Ajmer'],
    totalAreaHa: 34.0,
    totalParcels: 5,
    acquiredParcels: 3,
    inProgressParcels: 1,
    delayedParcels: 1,
    disputedParcels: 0,
    budgetCr: 95.0,
    disbursedCr: 62.0,
    startDate: '2025-04-01',
    targetCompletionDate: '2026-11-30',
  },
  {
    projectId: 'PRJ-108',
    name: 'Bharatmala Pariyojana NH-52 Jaipur-Reengus-Sikar Expressway',
    code: 'NHAI-BM-NH52',
    state: 'Rajasthan',
    districts: ['Jaipur', 'Sikar'],
    totalAreaHa: 165.0,
    totalParcels: 22,
    acquiredParcels: 14,
    inProgressParcels: 5,
    delayedParcels: 2,
    disputedParcels: 1,
    budgetCr: 610.0,
    disbursedCr: 380.0,
    startDate: '2024-08-01',
    targetCompletionDate: '2026-12-15',
  },
  {
    projectId: 'PRJ-109',
    name: 'Kota Chambal Riverfront Feeder Canal',
    code: 'KOTA-CHM-FDR',
    state: 'Rajasthan',
    districts: ['Kota'],
    totalAreaHa: 52.4,
    totalParcels: 4,
    acquiredParcels: 2,
    inProgressParcels: 1,
    delayedParcels: 1,
    disputedParcels: 0,
    budgetCr: 140.0,
    disbursedCr: 88.0,
    startDate: '2024-09-01',
    targetCompletionDate: '2026-09-30',
  },
  {
    projectId: 'PRJ-110',
    name: 'Udaipur Smart Green Transit Ring Road',
    code: 'UDZ-GRN-RING',
    state: 'Rajasthan',
    districts: ['Udaipur'],
    totalAreaHa: 76.8,
    totalParcels: 3,
    acquiredParcels: 1,
    inProgressParcels: 1,
    delayedParcels: 0,
    disputedParcels: 1,
    budgetCr: 210.0,
    disbursedCr: 90.0,
    startDate: '2025-05-01',
    targetCompletionDate: '2027-03-31',
  },
  {
    projectId: 'PRJ-111',
    name: 'Neemrana Multi-Modal Logistics Hub Extension',
    code: 'DMIC-NMR-HUB',
    state: 'Rajasthan',
    districts: ['Alwar'],
    totalAreaHa: 95.0,
    totalParcels: 3,
    acquiredParcels: 2,
    inProgressParcels: 1,
    delayedParcels: 0,
    disputedParcels: 0,
    budgetCr: 310.0,
    disbursedCr: 210.0,
    startDate: '2024-08-15',
    targetCompletionDate: '2026-07-31',
  },
];

export const STAGE_NAMES: StageName[] = [
  'Land Identification',
  'Survey',
  'Ownership Verification',
  'Document Verification',
  'Notification',
  'Objection Review',
  'Valuation',
  'Compensation Approval',
  'Payment',
  'Acquisition',
  'Handover',
];

// Helper to generate 11 stages with project and corridor-aware officer assignments
export function generate11Stages(
  completedCount: number,
  currentStageIdx: number,
  isDelayed: boolean,
  delayDays: number = 0,
  delayReason: string = '',
  projectMeta?: { code?: string; name?: string; district?: string }
) {
  const prjCode = projectMeta?.code || '';
  const dist = projectMeta?.district || 'Jaipur';

  // 1. Project Authority (Stage 11 - Handover)
  let projAuthority = 'Col. Sanjeev Nair (Project Authority)';
  let projDept = 'NHAI Project Office';

  if (prjCode.includes('WDFC') || prjCode.includes('DFCCIL')) {
    projAuthority = 'Rajesh Aggarwal (Chief Project Manager, DFCCIL)';
    projDept = 'DFCCIL Western Corridor Unit / Railways';
  } else if (prjCode.includes('JMRC') || prjCode.includes('M2')) {
    projAuthority = 'Sunil Godha (General Manager Land & Civil, JMRC)';
    projDept = 'JMRC Land Cell / Metro Directorate';
  } else if (prjCode.includes('KOTA') || prjCode.includes('DVE')) {
    projAuthority = 'D.K. Chaturvedi (Project Director, NHAI Kota)';
    projDept = 'NHAI Corridor PIU Kota';
  } else if (prjCode.includes('SLR') || prjCode.includes('MNRE')) {
    projAuthority = 'Dr. Mahendra Bishnoi (Nodal Officer Renewable Energy, RRECL)';
    projDept = 'RRECL Mega Solar Cell / MNRE';
  } else if (prjCode.includes('RIICO') || prjCode.includes('LOG')) {
    projAuthority = 'Harish Chandra Yadav (Senior Regional Manager, RIICO)';
    projDept = 'RIICO Industrial Estate Authority';
  }

  // 2. District Competent Land Acquisition Authority (Stages 3, 4, 5, 10)
  let distOfficer = 'Ashok Kumar Meena (District Officer)';
  let distDept = 'District Revenue Office';

  if (dist === 'Kota' || dist === 'Bundi') {
    distOfficer = 'Smt. Ritu Jain (SDM & Competent LA Authority)';
    distDept = 'District Revenue Collectorate, Kota';
  } else if (dist === 'Jodhpur' || dist === 'Bikaner') {
    distOfficer = 'Babu Lal Bishnoi (SDM & Land Acquisition Officer)';
    distDept = 'District Revenue Collectorate, Bikaner';
  } else if (dist === 'Alwar') {
    distOfficer = 'Rajendra Sharma (ADM & Competent Authority Land Acquisition)';
    distDept = 'District Revenue Office, Alwar';
  } else if (dist === 'Ajmer') {
    distOfficer = 'Girish Pareek (SDM & Land Acquisition Officer)';
    distDept = 'District Revenue Office, Ajmer';
  } else if (dist === 'Dausa') {
    distOfficer = 'Mahendra Meena (SDM & Land Acquisition Officer)';
    distDept = 'District Revenue Office, Dausa';
  }

  // 3. Cadastral Survey & Demarcation (Stages 1, 2)
  let surveyOfficer = 'Vikram Singh (Survey Officer)';
  let surveyDept = 'Directorate of Land Records';

  if (dist === 'Kota' || dist === 'Bundi') {
    surveyOfficer = 'Mohan Lal Sharma (Senior Cadastral Surveyor)';
    surveyDept = 'Directorate of Land Records, Kota Circle';
  } else if (dist === 'Jodhpur' || dist === 'Bikaner') {
    surveyOfficer = 'Narpat Singh Rathore (DGPS Survey Inspector)';
    surveyDept = 'Directorate of Land Records, Western Zone';
  } else if (dist === 'Alwar') {
    surveyOfficer = 'Dinesh Chand Meena (Survey Officer)';
    surveyDept = 'Directorate of Land Records, NCR Circle';
  } else if (dist === 'Ajmer') {
    surveyOfficer = 'Subhash Verma (Cadastral Officer)';
    surveyDept = 'Directorate of Land Records, Ajmer Circle';
  }

  const officersMap: Record<number, { officer: string; dept: string }> = {
    1: { officer: surveyOfficer, dept: surveyDept },
    2: { officer: surveyOfficer, dept: surveyDept },
    3: { officer: distOfficer, dept: distDept },
    4: { officer: distOfficer, dept: distDept },
    5: { officer: distOfficer, dept: distDept },
    6: { officer: 'Priyanka Rathore (Legal Officer)', dept: 'Revenue Legal Cell' },
    7: { officer: 'R.K. Sharma (Finance Officer)', dept: 'District Finance' },
    8: { officer: 'R.K. Sharma (Finance Officer)', dept: 'District Finance' },
    9: { officer: 'R.K. Sharma (Finance Officer)', dept: 'District Treasury' },
    10: { officer: distOfficer, dept: distDept },
    11: { officer: projAuthority, dept: projDept },
  };

  return STAGE_NAMES.map((name, index) => {
    const stageNum = index + 1;
    const { officer, dept } = officersMap[stageNum];
    let status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED' | 'BLOCKED' | 'REJECTED' = 'NOT_STARTED';
    let currentDelay = 0;
    let currentReason: string | undefined = undefined;
    let completedDate: string | undefined = undefined;

    if (index < completedCount) {
      status = 'COMPLETED';
      completedDate = `2025-0${Math.min(9, Math.max(1, index + 2))}-15`;
    } else if (index === currentStageIdx) {
      if (isDelayed) {
        status = 'DELAYED';
        currentDelay = delayDays;
        currentReason = delayReason;
      } else {
        status = 'IN_PROGRESS';
      }
    } else {
      status = 'NOT_STARTED';
    }

    return {
      id: `STG-${stageNum}-${Math.random().toString(36).substring(7)}`,
      stageNumber: stageNum,
      name,
      status,
      assignedOfficer: officer,
      assignedDepartment: dept,
      startDate: index <= currentStageIdx ? `2025-0${Math.min(9, Math.max(1, index + 1))}-01` : undefined,
      dueDate: `2025-0${Math.min(9, Math.max(1, index + 2))}-28`,
      completedDate,
      delayDays: currentDelay,
      delayReason: currentReason,
      remarks: status === 'COMPLETED' ? 'Stage verified and formally accepted.' : undefined,
    };
  });
}

// -------------------------------------------------------------
// SEED PARCELS (100+ parcels)
// -------------------------------------------------------------
const baseJaipurCoords = { lat: 26.8245, lng: 75.8122 };

export const SEED_PARCELS: Parcel[] = [];

// 1. STAR DEMO CASE: P-1024
const p1024Stages = generate11Stages(7, 7, true, 4, 'Compensation Approval delayed by 4 days due to area discrepancy review');
SEED_PARCELS.push({
  parcelId: 'P-1024',
  khasraNumber: '124/3',
  district: 'Jaipur',
  tehsil: 'Sanganer',
  village: 'Demo Village (Ramnagar)',
  project: 'Highway Expansion Project (NH-48 Jaipur Bypass)',
  projectId: 'PRJ-101',
  area: 2.1, // 2.10 hectare in DB
  latitude: 26.8182,
  longitude: 75.7954,
  polygonCoordinates: [
    [26.8192, 75.7942],
    [26.8201, 75.7971],
    [26.8175, 75.7983],
    [26.8166, 75.7951],
  ],
  status: 'DELAYED',
  currentStage: 'Compensation Approval',
  riskLevel: 'HIGH',
  riskScore: 7,
  riskReasons: [
    'Document Mismatch: Area in physical deed (2.40 ha) exceeds recorded database area (2.10 ha) by +0.30 ha',
    'Compensation Approval deadline overdue by 4 days',
    'Pending statutory verification before treasury disbursement',
  ],
  ownerReference: 'SYN-OWN-1024 (Ramlal Yadav & Sons)',
  ownerType: 'Joint Family',
  currentOfficer: 'R.K. Sharma (Finance Officer)',
  currentDepartment: 'District Finance',
  digitalFileId: 'LA-2026-01024',
  progress: 72.7, // 8 completed out of 11: 72.7% -> 73%
  delayDays: 4,
  delayReason: 'Area mismatch between deed and database requires formal reconciliation prior to financial sanction.',
  lastUpdated: '2026-09-23T08:30:00Z',
  stages: p1024Stages,
  dispute: undefined,
  compensation: {
    parcelId: 'P-1024',
    baseRatePerHa: 45.0, // 45 Lakhs / ha
    totalMarketValueLakhs: 94.5,
    solatiumLakhs: 94.5, // 100%
    multiplicationFactor: 1.25,
    totalAwardLakhs: 212.62,
    paymentStatus: 'APPROVAL_PENDING',
    beneficiaries: [
      {
        name: 'Ramlal Yadav (Elder Co-sharer)',
        sharePercentage: 50,
        amountLakhs: 106.31,
        bankAccountMasked: 'SBIN-XXXX-4912',
        kycStatus: 'VERIFIED',
      },
      {
        name: 'Gajendra Yadav (Co-sharer)',
        sharePercentage: 50,
        amountLakhs: 106.31,
        bankAccountMasked: 'HDFC-XXXX-8821',
        kycStatus: 'VERIFIED',
      },
    ],
  },
});

// CASE 2: Normal / on track (P-1001)
const p1001Stages = generate11Stages(11, 10, false);
SEED_PARCELS.push({
  parcelId: 'P-1001',
  khasraNumber: '89/1',
  district: 'Jaipur',
  tehsil: 'Sanganer',
  village: 'Sitapura Industrial Feeder',
  project: 'Highway Expansion Project (NH-48 Jaipur Bypass)',
  projectId: 'PRJ-101',
  area: 1.85,
  latitude: 26.8315,
  longitude: 75.8214,
  polygonCoordinates: [
    [26.8322, 75.8202],
    [26.8329, 75.8231],
    [26.8306, 75.8228],
    [26.8301, 75.8198],
  ],
  status: 'ACQUIRED',
  currentStage: 'Handover',
  riskLevel: 'LOW',
  riskScore: 0,
  riskReasons: [],
  ownerReference: 'SYN-OWN-1001 (Kalyan Sahay Sharma)',
  ownerType: 'Private Individual',
  currentOfficer: 'Col. Sanjeev Nair (Project Authority)',
  currentDepartment: 'NHAI Project Office',
  digitalFileId: 'LA-2025-01001',
  progress: 100,
  delayDays: 0,
  lastUpdated: '2026-09-18T10:15:00Z',
  stages: p1001Stages,
});

// CASE 3: Delayed Survey (P-1015)
const p1015Stages = generate11Stages(1, 1, true, 14, 'Submerged terrain following canal breach; GPS DGPS triangulation postponed');
SEED_PARCELS.push({
  parcelId: 'P-1015',
  khasraNumber: '44/2',
  district: 'Jaipur',
  tehsil: 'Chaksu',
  village: 'Nimeda',
  project: 'Highway Expansion Project (NH-48 Jaipur Bypass)',
  projectId: 'PRJ-101',
  area: 3.4,
  latitude: 26.7915,
  longitude: 75.8341,
  polygonCoordinates: [
    [26.7925, 75.833],
    [26.7932, 75.836],
    [26.7905, 75.8355],
    [26.7898, 75.8328],
  ],
  status: 'DELAYED',
  currentStage: 'Survey',
  riskLevel: 'MEDIUM',
  riskScore: 4,
  riskReasons: ['Survey deadline overdue by 14 days', 'Waterlogging at boundary pillared marks'],
  ownerReference: 'SYN-OWN-1015 (Ghanshyam Gurjar)',
  ownerType: 'Private Individual',
  currentOfficer: 'Vikram Singh (Survey Officer)',
  currentDepartment: 'Directorate of Land Records',
  digitalFileId: 'LA-2026-01015',
  progress: 9.1,
  delayDays: 14,
  delayReason: 'Survey delayed by 14 days due to ground inundation.',
  lastUpdated: '2026-09-20T14:20:00Z',
  stages: p1015Stages,
});

// CASE 4: Active Dispute / Court Stay (P-1077)
const p1077Stages = generate11Stages(5, 5, true, 28, 'Interim stay order granted by High Court in Civil Suit No. 2024/881');
SEED_PARCELS.push({
  parcelId: 'P-1077',
  khasraNumber: '312/1',
  district: 'Jaipur',
  tehsil: 'Amer',
  village: 'Kukas Extension',
  project: 'Highway Expansion Project (NH-48 Jaipur Bypass)',
  projectId: 'PRJ-101',
  area: 4.12,
  latitude: 26.9854,
  longitude: 75.8924,
  polygonCoordinates: [
    [26.9868, 26.9854],
    [26.9875, 75.8942],
    [26.9841, 75.8938],
    [26.9835, 75.8912],
  ],
  status: 'DISPUTED',
  currentStage: 'Objection Review',
  riskLevel: 'HIGH',
  riskScore: 8,
  riskReasons: [
    'Active High Court Stay Order (Civil Writ Petition 4920/2025)',
    'Objection Review delayed by 28 days',
    'Dispute over ancestral partition shares between legal heirs',
  ],
  ownerReference: 'SYN-OWN-1077 (Estate of Late Thakur B. Singh)',
  ownerType: 'Joint Family',
  currentOfficer: 'Priyanka Rathore (Legal Officer)',
  currentDepartment: 'Revenue Legal Cell',
  digitalFileId: 'LA-2026-01077',
  progress: 45.5,
  delayDays: 28,
  delayReason: 'Court stay prohibits mutation until title suit disposition.',
  lastUpdated: '2026-09-22T11:00:00Z',
  stages: p1077Stages,
  dispute: {
    disputeId: 'DISP-77',
    parcelId: 'P-1077',
    petitioner: 'Mahendra Singh & Ors.',
    courtOrForum: 'Hon’ble High Court of Rajasthan, Jaipur Bench',
    caseNumber: 'CWP-4920/2025',
    filingDate: '2025-04-18',
    status: 'STAY_ORDER',
    summary: 'Challenge to Section 11 Preliminary Notification claiming non-service of personal notice under RFCTLARR Act 2013.',
    stayGranted: true,
  },
});

// CASE 5: Government Land (P-1010)
const p1010Stages = generate11Stages(11, 10, false);
SEED_PARCELS.push({
  parcelId: 'P-1010',
  khasraNumber: '501/Govt',
  district: 'Jaipur',
  tehsil: 'Sanganer',
  village: 'Goner Road Intersect',
  project: 'Highway Expansion Project (NH-48 Jaipur Bypass)',
  projectId: 'PRJ-101',
  area: 5.6,
  latitude: 26.8041,
  longitude: 75.8451,
  status: 'ACQUIRED',
  currentStage: 'Handover',
  riskLevel: 'LOW',
  riskScore: 0,
  riskReasons: [],
  ownerReference: 'Govt. of Rajasthan (Forest & PWD Rights)',
  ownerType: 'Government Land',
  currentOfficer: 'Col. Sanjeev Nair (Project Authority)',
  currentDepartment: 'NHAI Project Office',
  digitalFileId: 'LA-2025-01010',
  progress: 100,
  delayDays: 0,
  lastUpdated: '2026-09-12T09:00:00Z',
  stages: p1010Stages,
});

// CASE 6: Returned File (P-1042)
const p1042Stages = generate11Stages(3, 3, false, 0);
SEED_PARCELS.push({
  parcelId: 'P-1042',
  khasraNumber: '78/9',
  district: 'Jaipur',
  tehsil: 'Bassi',
  village: 'Kanota North',
  project: 'Highway Expansion Project (NH-48 Jaipur Bypass)',
  projectId: 'PRJ-101',
  area: 1.45,
  latitude: 26.8712,
  longitude: 75.9421,
  status: 'IN_PROGRESS',
  currentStage: 'Document Verification',
  riskLevel: 'MEDIUM',
  riskScore: 5,
  riskReasons: ['File returned by Revenue Officer: Missing Jamabandi mutation stamp', 'Resubmission pending correction'],
  ownerReference: 'SYN-OWN-1042 (Harish Meena)',
  ownerType: 'Private Individual',
  currentOfficer: 'Vikram Singh (Survey Officer)',
  currentDepartment: 'Directorate of Land Records',
  digitalFileId: 'LA-2026-01042',
  progress: 27.3,
  delayDays: 0,
  lastUpdated: '2026-09-22T16:45:00Z',
  stages: p1042Stages,
});

// Generate 95 more diverse parcels across Rajasthan districts and projects
const districtsList = ['Jaipur', 'Alwar', 'Ajmer', 'Kota', 'Dausa', 'Jodhpur'];
const villages = [
  'Mansarovar Outer',
  'Muhana Mandi Link',
  'Bindayaka',
  'Bagru Road',
  'Jagatpura Extension',
  'Kukas',
  'Behror Border',
  'Bhiwadi South',
  'Kishangarh Toll',
  'Palsana Bypass',
  'Sangod Corridor',
  'Borbaad',
  'Goner',
  'Shivdaspura',
];

for (let i = 7; i <= 105; i++) {
  const pId = `P-1${i < 10 ? '00' + i : i < 100 ? '0' + i : i}`;
  const prj = DEMO_PROJECTS[i % DEMO_PROJECTS.length];
  const dist = prj.districts[i % prj.districts.length];
  const vlg = villages[i % villages.length];
  const khasra = `${100 + (i * 7) % 350}/${1 + (i % 4)}`;
  const area = Number((0.65 + (i * 0.17) % 4.5).toFixed(2));

  // Determine stage & status distribution
  let completedCount = (i * 3) % 12;
  let status: Parcel['status'] = 'IN_PROGRESS';
  let riskLevel: Parcel['riskLevel'] = 'LOW';
  let riskScore = 0;
  const riskReasons: string[] = [];
  let isDelayed = false;
  let delayDays = 0;
  let delayReason = '';

  if (completedCount >= 11) {
    status = 'ACQUIRED';
    completedCount = 11;
  } else if (i % 8 === 0) {
    status = 'DELAYED';
    isDelayed = true;
    delayDays = 6 + (i % 15);
    riskLevel = delayDays > 10 ? 'HIGH' : 'MEDIUM';
    riskScore = delayDays > 10 ? 6 : 4;
    delayReason = `Department backlog: Verification exceeded SLA by ${delayDays} days.`;
    riskReasons.push(`Overdue task by ${delayDays} days`, 'Verification queue backlog');
  } else if (i % 17 === 0) {
    status = 'DISPUTED';
    riskLevel = 'HIGH';
    riskScore = 8;
    delayDays = 21;
    isDelayed = true;
    delayReason = 'Local revenue court dispute over demarcation boundary.';
    riskReasons.push('Active civil dispute on boundary demarcations', 'Stay application filed by abutting owner');
  } else if (i % 5 === 0) {
    riskLevel = 'MEDIUM';
    riskScore = 3;
    riskReasons.push('Nearing stage deadline in 2 days');
  }

  const currentStageIdx = Math.min(10, completedCount);
  const currentStageName = STAGE_NAMES[currentStageIdx];
  const stages = generate11Stages(completedCount, currentStageIdx, isDelayed, delayDays, delayReason, {
    code: prj.code,
    name: prj.name,
    district: dist,
  });

  const latOffset = ((i % 10) - 5) * 0.024;
  const lngOffset = ((Math.floor(i / 10) % 10) - 5) * 0.028;

  const lat = baseJaipurCoords.lat + latOffset + (dist === 'Kota' ? -1.5 : dist === 'Alwar' ? 0.8 : dist === 'Ajmer' ? -0.4 : 0);
  const lng = baseJaipurCoords.lng + lngOffset + (dist === 'Kota' ? 0.3 : dist === 'Alwar' ? 0.7 : dist === 'Ajmer' ? -0.9 : 0);

  const calcProgress = Number(((completedCount / 11) * 100).toFixed(1));

  SEED_PARCELS.push({
    parcelId: pId,
    khasraNumber: khasra,
    district: dist,
    tehsil: `${dist} Sadar`,
    village: vlg,
    project: prj.name,
    projectId: prj.projectId,
    area,
    latitude: Number(lat.toFixed(5)),
    longitude: Number(lng.toFixed(5)),
    status,
    currentStage: currentStageName,
    riskLevel,
    riskScore,
    riskReasons,
    ownerReference: `SYN-OWN-${1000 + i} (${['Devi Lal', 'Babulal Jat', 'Manohar Singh', 'Smt. Kamla Devi', 'Mohan Lal'][i % 5]})`,
    ownerType: i % 11 === 0 ? 'Government Land' : i % 7 === 0 ? 'Joint Family' : 'Private Individual',
    currentOfficer: stages[currentStageIdx]?.assignedOfficer || 'Ashok Kumar Meena (District Officer)',
    currentDepartment: stages[currentStageIdx]?.assignedDepartment || 'District Revenue Office',
    digitalFileId: `LA-2026-${pId.replace('P-', '0')}`,
    progress: calcProgress,
    delayDays,
    delayReason: delayReason || undefined,
    lastUpdated: '2026-09-23T06:00:00Z',
    stages,
  });
}

// -------------------------------------------------------------
// SEED DIGITAL FILES
// -------------------------------------------------------------
export const SEED_FILES: DigitalFile[] = [
  // P-1024's digital file - Currently SENT to Finance Officer (Incoming Files tab!)
  {
    fileId: 'LA-2026-01024',
    parcelId: 'P-1024',
    project: 'Highway Expansion Project (NH-48 Jaipur Bypass)',
    currentStage: 'Compensation Approval',
    currentOfficer: 'R.K. Sharma (Finance Officer)',
    currentDepartment: 'District Finance',
    previousOfficer: 'Ashok Kumar Meena (District Officer)',
    previousDepartment: 'District Revenue Office',
    status: 'SENT', // SENT means Finance Officer has it in INCOMING FILES awaiting [ACCEPT FILE]!
    receivedDate: '2026-09-22T14:30:00Z',
    dueDate: '2026-09-25T17:00:00Z',
    priority: 'CRITICAL',
    risk: 'HIGH',
    movementHistory: [
      {
        stepId: 'MOV-1024-1',
        fromOfficer: 'Vikram Singh (Survey Officer)',
        fromDepartment: 'Directorate of Land Records',
        toOfficer: 'Ashok Kumar Meena (District Officer)',
        toDepartment: 'District Revenue Office',
        timestamp: '2025-06-12T10:00:00Z',
        status: 'COMPLETED',
        purpose: 'Cadastral Survey and demarcation field book forwarded.',
      },
      {
        stepId: 'MOV-1024-2',
        fromOfficer: 'Ashok Kumar Meena (District Officer)',
        fromDepartment: 'District Revenue Office',
        toOfficer: 'Priyanka Rathore (Legal Officer)',
        toDepartment: 'Revenue Legal Cell',
        timestamp: '2025-07-20T11:30:00Z',
        status: 'COMPLETED',
        purpose: 'Section 15 Objection Report & title scrutiny clearance.',
      },
      {
        stepId: 'MOV-1024-3',
        fromOfficer: 'Priyanka Rathore (Legal Officer)',
        fromDepartment: 'Revenue Legal Cell',
        toOfficer: 'Ashok Kumar Meena (District Officer)',
        toDepartment: 'District Revenue Office',
        timestamp: '2025-08-14T16:00:00Z',
        status: 'COMPLETED',
        purpose: 'Legal non-encumbrance certificate cleared.',
      },
      {
        stepId: 'MOV-1024-4',
        fromOfficer: 'Ashok Kumar Meena (District Officer)',
        fromDepartment: 'District Revenue Office',
        toOfficer: 'R.K. Sharma (Finance Officer)',
        toDepartment: 'District Finance',
        timestamp: '2026-09-22T14:30:00Z',
        status: 'SENT',
        purpose: 'Valuation award vetted. Forwarded for final compensation approval and treasury escrow sanction.',
        dueDate: '2026-09-25T17:00:00Z',
      },
    ],
  },
  // P-1042 - Returned file in Survey Officer's RETURNED queue
  {
    fileId: 'LA-2026-01042',
    parcelId: 'P-1042',
    project: 'Highway Expansion Project (NH-48 Jaipur Bypass)',
    currentStage: 'Document Verification',
    currentOfficer: 'Vikram Singh (Survey Officer)',
    currentDepartment: 'Directorate of Land Records',
    previousOfficer: 'Ashok Kumar Meena (District Officer)',
    previousDepartment: 'District Revenue Office',
    status: 'RETURNED',
    receivedDate: '2026-09-21T09:15:00Z',
    dueDate: '2026-09-26T17:00:00Z',
    priority: 'HIGH',
    risk: 'MEDIUM',
    returnReasonCategory: 'Data Mismatch',
    returnRemarks: 'Survey demarcation coordinate pillar 3 overlaps adjoining khasra 78/8.',
    requiredCorrection: 'Resurvey corner boundary pillar and upload authenticated corrected survey map.',
    movementHistory: [
      {
        stepId: 'MOV-1042-1',
        fromOfficer: 'Vikram Singh (Survey Officer)',
        fromDepartment: 'Directorate of Land Records',
        toOfficer: 'Ashok Kumar Meena (District Officer)',
        toDepartment: 'District Revenue Office',
        timestamp: '2026-09-18T10:00:00Z',
        status: 'FORWARDED',
        purpose: 'Submitted for Document Verification',
      },
      {
        stepId: 'MOV-1042-2',
        fromOfficer: 'Ashok Kumar Meena (District Officer)',
        fromDepartment: 'District Revenue Office',
        toOfficer: 'Vikram Singh (Survey Officer)',
        toDepartment: 'Directorate of Land Records',
        timestamp: '2026-09-21T09:15:00Z',
        status: 'RETURNED',
        purpose: 'Boundary Pillar Discrepancy',
        returnReason: 'Data Mismatch',
        requiredCorrection: 'Resurvey corner boundary pillar and upload authenticated corrected survey map.',
      },
    ],
  },
  // P-1015 - Survey Officer active survey file
  {
    fileId: 'LA-2026-01015',
    parcelId: 'P-1015',
    project: 'Highway Expansion Project (NH-48 Jaipur Bypass)',
    currentStage: 'Survey',
    currentOfficer: 'Vikram Singh (Survey Officer)',
    currentDepartment: 'Directorate of Land Records',
    status: 'UNDER_REVIEW',
    receivedDate: '2026-09-02T10:00:00Z',
    dueDate: '2026-09-08T17:00:00Z',
    priority: 'HIGH',
    risk: 'MEDIUM',
    movementHistory: [
      {
        stepId: 'MOV-1015-1',
        fromOfficer: 'Ashok Kumar Meena (District Officer)',
        fromDepartment: 'District Revenue Office',
        toOfficer: 'Vikram Singh (Survey Officer)',
        toDepartment: 'Directorate of Land Records',
        timestamp: '2026-09-02T10:00:00Z',
        status: 'ACCEPTED',
        purpose: 'Initiate Section 12 Cadastral Survey & DGPS coordinates.',
      },
    ],
  },
  // P-1077 - Legal Officer disputed file
  {
    fileId: 'LA-2026-01077',
    parcelId: 'P-1077',
    project: 'Highway Expansion Project (NH-48 Jaipur Bypass)',
    currentStage: 'Objection Review',
    currentOfficer: 'Priyanka Rathore (Legal Officer)',
    currentDepartment: 'Revenue Legal Cell',
    previousOfficer: 'Ashok Kumar Meena (District Officer)',
    previousDepartment: 'District Revenue Office',
    status: 'UNDER_REVIEW',
    receivedDate: '2026-08-10T12:00:00Z',
    dueDate: '2026-08-25T17:00:00Z',
    priority: 'CRITICAL',
    risk: 'HIGH',
    movementHistory: [
      {
        stepId: 'MOV-1077-1',
        fromOfficer: 'Ashok Kumar Meena (District Officer)',
        fromDepartment: 'District Revenue Office',
        toOfficer: 'Priyanka Rathore (Legal Officer)',
        toDepartment: 'Revenue Legal Cell',
        timestamp: '2026-08-10T12:00:00Z',
        status: 'ACCEPTED',
        purpose: 'Legal opinion on writ stay petition 4920/2025 and appeal response preparation.',
      },
    ],
  },
  // P-1008 - Finance Officer Active File
  {
    fileId: 'LA-2026-01008',
    parcelId: 'P-1008',
    project: 'Highway Expansion Project (NH-48 Jaipur Bypass)',
    currentStage: 'Compensation Approval',
    currentOfficer: 'R.K. Sharma (Finance Officer)',
    currentDepartment: 'District Finance',
    previousOfficer: 'Ashok Kumar Meena (District Officer)',
    previousDepartment: 'District Revenue Office',
    status: 'UNDER_REVIEW',
    receivedDate: '2026-09-19T11:00:00Z',
    dueDate: '2026-09-28T17:00:00Z',
    priority: 'MEDIUM',
    risk: 'LOW',
    movementHistory: [
      {
        stepId: 'MOV-1008-1',
        fromOfficer: 'Ashok Kumar Meena (District Officer)',
        fromDepartment: 'District Revenue Office',
        toOfficer: 'R.K. Sharma (Finance Officer)',
        toDepartment: 'District Finance',
        timestamp: '2026-09-19T11:00:00Z',
        status: 'ACCEPTED',
        purpose: 'Compensation sanction vetting.',
      },
    ],
  },
  // P-1002 - Completed file
  {
    fileId: 'LA-2025-01002',
    parcelId: 'P-1002',
    project: 'Highway Expansion Project (NH-48 Jaipur Bypass)',
    currentStage: 'Handover',
    currentOfficer: 'Col. Sanjeev Nair (Project Authority)',
    currentDepartment: 'NHAI Project Office',
    status: 'COMPLETED',
    receivedDate: '2025-11-05T10:00:00Z',
    dueDate: '2025-11-20T17:00:00Z',
    priority: 'LOW',
    risk: 'LOW',
    movementHistory: [
      {
        stepId: 'MOV-1002-1',
        fromOfficer: 'R.K. Sharma (Finance Officer)',
        fromDepartment: 'District Finance',
        toOfficer: 'Col. Sanjeev Nair (Project Authority)',
        toDepartment: 'NHAI Project Office',
        timestamp: '2025-11-05T10:00:00Z',
        status: 'COMPLETED',
        purpose: 'Handover letter executed after direct bank disbursement.',
      },
    ],
  },
];

// Add additional files for realism
for (let i = 11; i <= 35; i++) {
  const pId = `P-1${i < 100 ? '0' + i : i}`;
  const p = SEED_PARCELS.find((x) => x.parcelId === pId);
  if (p) {
    SEED_FILES.push({
      fileId: p.digitalFileId,
      parcelId: p.parcelId,
      project: p.project,
      currentStage: p.currentStage,
      currentOfficer: p.currentOfficer,
      currentDepartment: p.currentDepartment,
      status: i % 4 === 0 ? 'ACCEPTED' : i % 5 === 0 ? 'SENT' : 'UNDER_REVIEW',
      receivedDate: '2026-09-15T09:00:00Z',
      dueDate: '2026-09-30T17:00:00Z',
      priority: p.riskLevel === 'HIGH' ? 'CRITICAL' : p.riskLevel === 'MEDIUM' ? 'HIGH' : 'MEDIUM',
      risk: p.riskLevel,
      movementHistory: [
        {
          stepId: `MOV-${pId}-1`,
          fromOfficer: 'Ashok Kumar Meena (District Officer)',
          fromDepartment: 'District Revenue Office',
          toOfficer: p.currentOfficer,
          toDepartment: p.currentDepartment,
          timestamp: '2026-09-15T09:00:00Z',
          status: 'ACCEPTED',
          purpose: `Process workflow for ${p.currentStage}`,
        },
      ],
    });
  }
}

// -------------------------------------------------------------
// SEED DOCUMENTS (50+ documents)
// -------------------------------------------------------------
export const SEED_DOCUMENTS: CaseDocument[] = [
  // P-1024 STAR CASE: Document Mismatch!
  {
    id: 'DOC-1024-OWN',
    parcelId: 'P-1024',
    type: 'Ownership Proof',
    title: 'Registered Sale Deed No. 4192/2014 & Mutation Record',
    fileName: 'Deed_P1024_Khasra124_3.pdf',
    fileSize: '4.2 MB',
    uploadedBy: 'Ashok Kumar Meena (District Officer)',
    uploadedDate: '2025-05-18T14:20:00Z',
    status: 'UNDER_VERIFICATION',
    remarks: 'Document extracted area does not match land revenue database record.',
    extractedData: {
      ownerName: 'Ramlal Yadav & Sons',
      khasraNumber: '124/3',
      areaHa: 2.4, // MISMATCH: 2.40 ha in document!
      village: 'Demo Village (Ramnagar)',
      district: 'Jaipur',
      docDate: '2014-08-12',
    },
    mismatches: [
      {
        field: 'Area (Hectares)',
        documentValue: '2.40 ha',
        databaseValue: '2.10 ha',
        discrepancy: '+0.30 ha excess in presented physical deed',
        severity: 'CRITICAL',
      },
    ],
  },
  {
    id: 'DOC-1024-SRV',
    parcelId: 'P-1024',
    type: 'Survey Report',
    title: 'Cadastral Field Book & DGPS Demarcation Map',
    fileName: 'Survey_DGPS_P1024_Signed.pdf',
    fileSize: '7.8 MB',
    uploadedBy: 'Vikram Singh (Survey Officer)',
    uploadedDate: '2025-04-20T11:00:00Z',
    status: 'VERIFIED',
    verifiedBy: 'Ashok Kumar Meena (District Officer)',
    verifiedDate: '2025-04-25T15:00:00Z',
    extractedData: {
      khasraNumber: '124/3',
      areaHa: 2.1,
      village: 'Demo Village (Ramnagar)',
      surveyNo: 'DGPS-SNG-2025-881',
    },
  },
  {
    id: 'DOC-1024-NOT',
    parcelId: 'P-1024',
    type: 'Acquisition Notice',
    title: 'Section 11(1) Preliminary Gazetted Notification',
    fileName: 'Gazette_Notif_Sec11_P1024.pdf',
    fileSize: '1.9 MB',
    uploadedBy: 'Ashok Kumar Meena (District Officer)',
    uploadedDate: '2025-07-02T10:30:00Z',
    status: 'VERIFIED',
    verifiedBy: 'Priyanka Rathore (Legal Officer)',
    verifiedDate: '2025-07-10T12:00:00Z',
  },
  {
    id: 'DOC-1024-VAL',
    parcelId: 'P-1024',
    type: 'Valuation Report',
    title: 'DLC Circle Rate & Market Valuation Matrix',
    fileName: 'Valuation_Matrix_P1024_Signed.pdf',
    fileSize: '3.1 MB',
    uploadedBy: 'R.K. Sharma (Finance Officer)',
    uploadedDate: '2025-09-10T16:45:00Z',
    status: 'VERIFIED',
    verifiedBy: 'R.K. Sharma (Finance Officer)',
    verifiedDate: '2025-09-12T10:00:00Z',
  },
  {
    id: 'DOC-1024-CMP',
    parcelId: 'P-1024',
    type: 'Compensation Document',
    title: 'Proposed Draft Award Schedule under Section 23',
    fileName: 'Draft_Award_Schedule_P1024.pdf',
    fileSize: '2.5 MB',
    uploadedBy: 'R.K. Sharma (Finance Officer)',
    uploadedDate: '2026-09-20T10:00:00Z',
    status: 'UNDER_VERIFICATION',
    remarks: 'Held pending reconciliation of area mismatch.',
  },
  // P-1015 Documents
  {
    id: 'DOC-1015-REC',
    parcelId: 'P-1015',
    type: 'Land Record',
    title: 'Jamabandi Copy & Naksha Trace',
    fileName: 'Jamabandi_P1015_Nimeda.pdf',
    fileSize: '3.3 MB',
    uploadedBy: 'Ashok Kumar Meena (District Officer)',
    uploadedDate: '2026-08-15T11:00:00Z',
    status: 'VERIFIED',
    verifiedBy: 'Vikram Singh (Survey Officer)',
    verifiedDate: '2026-08-18T14:00:00Z',
  },
  {
    id: 'DOC-1015-SRV',
    parcelId: 'P-1015',
    type: 'Survey Report',
    title: 'Field Survey Preliminary Inundation Note',
    fileName: 'Survey_Interim_Waterlog_P1015.pdf',
    fileSize: '5.1 MB',
    uploadedBy: 'Vikram Singh (Survey Officer)',
    uploadedDate: '2026-09-10T15:30:00Z',
    status: 'UNDER_VERIFICATION',
    remarks: 'Field pegs inundated; completion awaiting dry soil conditions.',
  },
  // P-1077 Documents
  {
    id: 'DOC-1077-OBJ',
    parcelId: 'P-1077',
    type: 'Objection Document',
    title: 'High Court Interim Stay Order & Writ Petition Notice',
    fileName: 'HC_Stay_Order_CWP_4920_2025.pdf',
    fileSize: '6.4 MB',
    uploadedBy: 'Priyanka Rathore (Legal Officer)',
    uploadedDate: '2025-04-20T12:00:00Z',
    status: 'VERIFIED',
    verifiedBy: 'Priyanka Rathore (Legal Officer)',
    verifiedDate: '2025-04-22T09:30:00Z',
    remarks: 'Active stay injunction. Acquisition halted at Stage 6.',
  },
];

// Generate documents for other parcels to reach 50+
for (let i = 1; i <= 25; i++) {
  const pId = `P-1${i < 10 ? '00' + i : '0' + i}`;
  SEED_DOCUMENTS.push({
    id: `DOC-${pId}-LR`,
    parcelId: pId,
    type: 'Land Record',
    title: `Record of Rights (Jamabandi) & Girdawari Extract - ${pId}`,
    fileName: `Jamabandi_${pId}.pdf`,
    fileSize: '2.1 MB',
    uploadedBy: 'Ashok Kumar Meena (District Officer)',
    uploadedDate: '2025-05-10T10:00:00Z',
    status: 'VERIFIED',
    verifiedBy: 'Ashok Kumar Meena (District Officer)',
    verifiedDate: '2025-05-15T12:00:00Z',
  });
  SEED_DOCUMENTS.push({
    id: `DOC-${pId}-SRV`,
    parcelId: pId,
    type: 'Survey Report',
    title: `Cadastral Map & Boundary Fixation Report - ${pId}`,
    fileName: `Cadastral_${pId}.pdf`,
    fileSize: '3.6 MB',
    uploadedBy: 'Vikram Singh (Survey Officer)',
    uploadedDate: '2025-06-01T14:00:00Z',
    status: 'VERIFIED',
    verifiedBy: 'Vikram Singh (Survey Officer)',
    verifiedDate: '2025-06-05T16:00:00Z',
  });
}

// -------------------------------------------------------------
// SEED TASKS (50+ tasks)
// -------------------------------------------------------------
export const SEED_TASKS: Task[] = [
  // P-1024 tasks
  {
    taskId: 'TSK-1024-1',
    taskName: 'Cross-examine 2.40 ha Sale Deed against Village Khasra Girdawari',
    parcelId: 'P-1024',
    stageName: 'Compensation Approval',
    assignedOfficer: 'R.K. Sharma (Finance Officer)',
    department: 'District Finance',
    status: 'DELAYED',
    priority: 'CRITICAL',
    createdDate: '2026-09-15',
    dueDate: '2026-09-19',
    delayDays: 4,
    delayReason: 'Area mismatch between deed and revenue records requires revenue office validation.',
    remarks: 'Awaiting revised calculation schedule or field confirmation.',
  },
  {
    taskId: 'TSK-1024-2',
    taskName: 'Verify Direct Benefit Transfer Escrow Account Details for Co-sharers',
    parcelId: 'P-1024',
    stageName: 'Compensation Approval',
    assignedOfficer: 'R.K. Sharma (Finance Officer)',
    department: 'District Finance',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    createdDate: '2026-09-20',
    dueDate: '2026-09-25',
    delayDays: 0,
    remarks: 'Bank KYC accounts verified; awaiting financial sanction approval.',
  },
  // P-1015 tasks
  {
    taskId: 'TSK-1015-1',
    taskName: 'Complete Cadastral Boundary DGPS Coordinates Survey',
    parcelId: 'P-1015',
    stageName: 'Survey',
    assignedOfficer: 'Vikram Singh (Survey Officer)',
    department: 'Directorate of Land Records',
    status: 'DELAYED',
    priority: 'HIGH',
    createdDate: '2026-08-25',
    dueDate: '2026-09-08',
    delayDays: 14,
    delayReason: 'Survey delayed by 14 days due to waterlogged terrain.',
    remarks: 'Rescheduled for DGPS rover survey once ground dries.',
  },
  // P-1077 tasks
  {
    taskId: 'TSK-1077-1',
    taskName: 'Draft Legal Counter-Affidavit for High Court Stay Hearing',
    parcelId: 'P-1077',
    stageName: 'Objection Review',
    assignedOfficer: 'Priyanka Rathore (Legal Officer)',
    department: 'Revenue Legal Cell',
    status: 'DELAYED',
    priority: 'CRITICAL',
    createdDate: '2025-08-01',
    dueDate: '2025-08-25',
    delayDays: 28,
    delayReason: 'Awaiting certified copies of family partition compromise decree.',
  },
];

// Add tasks across parcels
for (let i = 1; i <= 30; i++) {
  const pId = `P-1${i < 10 ? '00' + i : '0' + i}`;
  const p = SEED_PARCELS.find((x) => x.parcelId === pId);
  if (p) {
    SEED_TASKS.push({
      taskId: `TSK-${pId}-1`,
      taskName: `Verify Cadastral Boundaries & Pillar Demarcation for ${pId}`,
      parcelId: pId,
      stageName: 'Survey',
      assignedOfficer: 'Vikram Singh (Survey Officer)',
      department: 'Directorate of Land Records',
      status: p.status === 'ACQUIRED' ? 'COMPLETED' : 'IN_PROGRESS',
      priority: 'MEDIUM',
      createdDate: '2025-06-01',
      dueDate: '2025-06-20',
      delayDays: 0,
    });
    SEED_TASKS.push({
      taskId: `TSK-${pId}-2`,
      taskName: `Legal Encumbrance & Mutation Review for ${pId}`,
      parcelId: pId,
      stageName: 'Ownership Verification',
      assignedOfficer: 'Ashok Kumar Meena (District Officer)',
      department: 'District Revenue Office',
      status: p.status === 'ACQUIRED' ? 'COMPLETED' : 'IN_PROGRESS',
      priority: 'HIGH',
      createdDate: '2025-07-01',
      dueDate: '2025-07-25',
      delayDays: 0,
    });
  }
}

// -------------------------------------------------------------
// SEED AUDIT LOGS
// -------------------------------------------------------------
export const SEED_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'AUD-001',
    timestamp: '2026-09-22T14:30:00Z',
    user: 'Ashok Kumar Meena',
    role: 'District Officer',
    action: 'FORWARD_FILE',
    fileId: 'LA-2026-01024',
    parcelId: 'P-1024',
    previousStatus: 'UNDER_REVIEW',
    newStatus: 'SENT',
    remarks: 'Forwarded case file to Finance Officer for final compensation review and award vetting.',
  },
  {
    id: 'AUD-002',
    timestamp: '2026-09-21T09:15:00Z',
    user: 'Ashok Kumar Meena',
    role: 'District Officer',
    action: 'RETURN_FILE',
    fileId: 'LA-2026-01042',
    parcelId: 'P-1042',
    previousStatus: 'UNDER_REVIEW',
    newStatus: 'RETURNED',
    remarks: 'Returned to Survey Officer due to pillar 3 boundary overlap.',
  },
  {
    id: 'AUD-003',
    timestamp: '2026-09-20T16:00:00Z',
    user: 'Vikram Singh',
    role: 'Survey Officer',
    action: 'COMPLETE_SURVEY',
    fileId: 'LA-2026-01008',
    parcelId: 'P-1008',
    previousStatus: 'IN_PROGRESS',
    newStatus: 'COMPLETED',
    remarks: 'DGPS rover coordinates reconciled and signed.',
  },
  {
    id: 'AUD-004',
    timestamp: '2026-09-18T11:20:00Z',
    user: 'R.K. Sharma',
    role: 'Finance Officer',
    action: 'ACCEPT_FILE',
    fileId: 'LA-2026-01008',
    parcelId: 'P-1008',
    previousStatus: 'SENT',
    newStatus: 'UNDER_REVIEW',
    remarks: 'Finance Officer accepted file for compensation review.',
  },
];

// -------------------------------------------------------------
// SEED NOTIFICATIONS
// -------------------------------------------------------------
export const SEED_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'NOTIF-01',
    timestamp: '2026-09-22T14:30:00Z',
    type: 'New File Received',
    title: 'Incoming Compensation File: LA-2026-01024',
    message: 'File for Parcel P-1024 (Khasra 124/3) received from District Revenue Officer. Action required: Accept File.',
    parcelId: 'P-1024',
    fileId: 'LA-2026-01024',
    read: false,
    priority: 'HIGH',
  },
  {
    id: 'NOTIF-02',
    timestamp: '2026-09-21T09:15:00Z',
    type: 'File Returned',
    title: 'Action Required: File LA-2026-01042 Returned',
    message: 'District Revenue Officer returned File LA-2026-01042. Reason: Data Mismatch in corner boundary pillar.',
    parcelId: 'P-1042',
    fileId: 'LA-2026-01042',
    read: false,
    priority: 'HIGH',
  },
  {
    id: 'NOTIF-03',
    timestamp: '2026-09-20T08:00:00Z',
    type: 'Document Mismatch',
    title: 'Critical Mismatch Detected on P-1024',
    message: 'Physical deed states 2.40 ha while revenue database records 2.10 ha (+0.30 ha discrepancy).',
    parcelId: 'P-1024',
    fileId: 'LA-2026-01024',
    read: false,
    priority: 'HIGH',
  },
  {
    id: 'NOTIF-04',
    timestamp: '2026-09-19T10:00:00Z',
    type: 'Task Overdue',
    title: 'Survey Task Overdue: Parcel P-1015',
    message: 'Field demarcation survey for P-1015 is overdue by 14 days.',
    parcelId: 'P-1015',
    read: true,
    priority: 'MEDIUM',
  },
];
