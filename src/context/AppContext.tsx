import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Project,
  Parcel,
  DigitalFile,
  Task,
  CaseDocument,
  AuditLog,
  AppNotification,
  Role,
  DocumentStatus,
  TaskStatus,
  FileMovementStep,
} from '../types';
import {
  DEMO_USERS,
  DEMO_PROJECTS,
  SEED_PARCELS,
  SEED_FILES,
  SEED_DOCUMENTS,
  SEED_TASKS,
  SEED_AUDIT_LOGS,
  SEED_NOTIFICATIONS,
} from '../data/seedData';

interface AppContextType {
  currentUser: User;
  allUsers: User[];
  projects: Project[];
  parcels: Parcel[];
  files: DigitalFile[];
  tasks: Task[];
  documents: CaseDocument[];
  auditLogs: AuditLog[];
  notifications: AppNotification[];
  isAuthenticated: boolean;
  login: (roleOrEmailOrId: string) => void;
  logout: () => void;
  registerUser: (userData: {
    name: string;
    email: string;
    role: Role;
    department: string;
    district: string;
    phone?: string;
    employeeId?: string;
    designation?: string;
    password?: string;
  }) => User;
  validateCredentials: (identifier: string, pass: string) => { success: boolean; user?: User; error?: string };
  verifyOfficerPin: (pin: string) => boolean;
  updateOfficerPassword: (newPass: string) => void;
  updateOfficerPin: (newPin: string) => void;
  sessionTimeoutMinutes: number;
  setSessionTimeoutMinutes: (mins: number) => void;
  addOfficer: (officer: Partial<User> & { name: string; role: Role; department: string; email: string }) => User;
  switchUser: (roleOrEmail: string) => void;
  getParcel: (parcelId: string) => Parcel | undefined;
  getFile: (fileId: string) => DigitalFile | undefined;
  acceptFile: (fileId: string, remarks?: string) => Promise<void>;
  returnFile: (
    fileId: string,
    payload: {
      reasonCategory: string;
      remarks: string;
      requiredCorrection: string;
      returnToOfficer?: string;
      returnToDept?: string;
    }
  ) => Promise<void>;
  forwardFile: (
    fileId: string,
    payload: {
      nextOfficer: string;
      nextDepartment: string;
      purpose: string;
      remarks?: string;
      dueDate?: string;
    }
  ) => Promise<void>;
  resubmitFile: (fileId: string, payload: { remarks: string }) => Promise<void>;
  verifyDocument: (docId: string, status: DocumentStatus, remarks?: string) => Promise<void>;
  resolveDocumentMismatch: (docId: string, resolvedAreaHa: number, remarks: string) => Promise<void>;
  updateTaskStatus: (taskId: string, status: TaskStatus, delayReason?: string, remarks?: string) => Promise<void>;
  completeSurvey: (parcelId: string, evidenceRemarks: string) => Promise<void>;
  markNotificationRead: (id: string) => void;
  recalculateRisk: (parcelId: string) => void;
  askAiCopilot: (prompt: string, parcelId?: string) => Promise<string>;
  resetToDemoState: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'bhumi_sentinel_state_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state or use seed data
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_users`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((u: User) => ({
          ...u,
          password: u.password || 'Sentinel@2026',
          securityPin: u.securityPin || '1234',
        }));
      } catch (e) {}
    }
    return DEMO_USERS.map((u) => ({
      ...u,
      password: 'Sentinel@2026',
      securityPin: '1234',
    }));
  });

  const [sessionTimeoutMinutes, setSessionTimeoutMinutesState] = useState<number>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_timeout`);
    return saved ? Number(saved) : 15;
  });

  const setSessionTimeoutMinutes = (mins: number) => {
    setSessionTimeoutMinutesState(mins);
    localStorage.setItem(`${STORAGE_KEY}_timeout`, String(mins));
  };

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Fresh website visitors enter on login & registration first
    const sessionAuth = sessionStorage.getItem(`${STORAGE_KEY}_session_auth`);
    if (sessionAuth !== null) {
      return JSON.parse(sessionAuth);
    }
    const saved = localStorage.getItem(`${STORAGE_KEY}_auth`);
    return saved !== null ? JSON.parse(saved) : false;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedUser = localStorage.getItem(`${STORAGE_KEY}_current_user`);
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {}
    }
    return DEMO_USERS[0]; // Start with National Admin or switchable anytime
  });

  const [projects] = useState<Project[]>(DEMO_PROJECTS);
  const [parcels, setParcels] = useState<Parcel[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_parcels`);
    return saved ? JSON.parse(saved) : SEED_PARCELS;
  });

  const [files, setFiles] = useState<DigitalFile[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_files`);
    return saved ? JSON.parse(saved) : SEED_FILES;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_tasks`);
    return saved ? JSON.parse(saved) : SEED_TASKS;
  });

  const [documents, setDocuments] = useState<CaseDocument[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_documents`);
    return saved ? JSON.parse(saved) : SEED_DOCUMENTS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_audit`);
    return saved ? JSON.parse(saved) : SEED_AUDIT_LOGS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_notifications`);
    return saved ? JSON.parse(saved) : SEED_NOTIFICATIONS;
  });

  // Save changes to localStorage for session persistence
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_auth`, JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_current_user`, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_parcels`, JSON.stringify(parcels));
  }, [parcels]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_files`, JSON.stringify(files));
  }, [files]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_tasks`, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_documents`, JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_audit`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(notifications));
  }, [notifications]);

  // Switch role / demo user
  const switchUser = (roleOrEmailOrId: string) => {
    const term = roleOrEmailOrId.toLowerCase().trim();
    const found = allUsers.find(
      (u) =>
        u.id.toLowerCase() === term ||
        u.role.toLowerCase() === term ||
        u.email.toLowerCase() === term ||
        u.name.toLowerCase() === term
    );
    if (found) {
      setCurrentUser(found);
      setIsAuthenticated(true);
    }
  };

  const login = (roleOrEmailOrId: string) => {
    switchUser(roleOrEmailOrId);
    setIsAuthenticated(true);
    sessionStorage.setItem(`${STORAGE_KEY}_session_auth`, 'true');
    localStorage.setItem(`${STORAGE_KEY}_auth`, 'true');
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.setItem(`${STORAGE_KEY}_session_auth`, 'false');
    localStorage.setItem(`${STORAGE_KEY}_auth`, 'false');
  };

  const registerUser = (userData: {
    name: string;
    email: string;
    role: Role;
    department: string;
    district: string;
    phone?: string;
    employeeId?: string;
    designation?: string;
    password?: string;
  }): User => {
    const nextNum = allUsers.length + 1;
    const nextId = `USR-${String(nextNum).padStart(2, '0')}`;
    const newUser: User = {
      id: nextId,
      name: userData.name.trim(),
      email: userData.email.trim(),
      role: userData.role,
      designation: userData.designation?.trim() || `${userData.role} (${userData.department.trim()})`,
      department: userData.department.trim(),
      district: userData.district.trim() || 'Jaipur',
      state: 'Rajasthan',
      phone: userData.phone?.trim() || '+91 98290 ' + Math.floor(10000 + Math.random() * 90000),
      employeeId: userData.employeeId?.trim() || `GOV-RJ-${Math.floor(1000 + Math.random() * 9000)}`,
      dscStatus: 'ACTIVE',
      jurisdiction: `${userData.district.trim() || 'Jaipur'} Region`,
      joinedDate: new Date().toISOString().split('T')[0],
      rating: 5.0,
      password: userData.password?.trim() || 'Sentinel@2026',
      securityPin: '1234',
    };

    setAllUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    sessionStorage.setItem(`${STORAGE_KEY}_session_auth`, 'true');
    localStorage.setItem(`${STORAGE_KEY}_auth`, 'true');

    // Create system notification
    const newNotif: AppNotification = {
      id: `NOTIF-${Date.now()}`,
      type: 'New Officer Onboarded',
      title: 'Officer Account Registered',
      message: `Welcome ${newUser.name}! Your account has been registered as ${newUser.designation} (${newUser.department}).`,
      timestamp: new Date().toISOString(),
      read: false,
      priority: 'MEDIUM',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newUser;
  };

  const validateCredentials = (identifier: string, pass: string): { success: boolean; user?: User; error?: string } => {
    const idLower = identifier.trim().toLowerCase();
    const found = allUsers.find(
      (u) =>
        u.email.toLowerCase() === idLower ||
        u.employeeId?.toLowerCase() === idLower ||
        u.id.toLowerCase() === idLower ||
        u.name.toLowerCase() === idLower
    );

    if (!found) {
      return { success: false, error: 'Officer credential identifier not found in state directory.' };
    }

    const expectedPass = found.password || 'Sentinel@2026';
    if (pass !== expectedPass) {
      return { success: false, error: 'Incorrect statutory password entered.' };
    }

    return { success: true, user: found };
  };

  const verifyOfficerPin = (pin: string): boolean => {
    const expected = currentUser.securityPin || '1234';
    return pin.trim() === expected || pin.trim() === '1234';
  };

  const updateOfficerPassword = (newPass: string) => {
    if (!newPass || newPass.length < 6) return;
    setAllUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, password: newPass } : u))
    );
    setCurrentUser((prev) => ({ ...prev, password: newPass }));
  };

  const updateOfficerPin = (newPin: string) => {
    if (!newPin || newPin.length !== 4) return;
    setAllUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, securityPin: newPin } : u))
    );
    setCurrentUser((prev) => ({ ...prev, securityPin: newPin }));
  };

  const addOfficer = (officerData: Partial<User> & { name: string; role: Role; department: string; email: string }): User => {
    const nextNum = allUsers.length + 1;
    const nextId = `USR-${String(nextNum).padStart(2, '0')}`;
    const newOfficer: User = {
      id: officerData.id || nextId,
      name: officerData.name,
      email: officerData.email,
      role: officerData.role,
      designation: officerData.designation || `${officerData.role} (${officerData.department})`,
      department: officerData.department,
      district: officerData.district || 'Jaipur',
      state: officerData.state || 'Rajasthan',
      phone: officerData.phone || '+91 98290 ' + Math.floor(10000 + Math.random() * 90000),
      employeeId: officerData.employeeId || `GOV-RJ-${Math.floor(1000 + Math.random() * 9000)}`,
      dscStatus: officerData.dscStatus || 'ACTIVE',
      jurisdiction: officerData.jurisdiction || `${officerData.district || 'Jaipur'} Region`,
      joinedDate: new Date().toISOString().split('T')[0],
      rating: 4.9,
    };

    setAllUsers((prev) => [newOfficer, ...prev]);

    // Create system notification
    const newNotif: AppNotification = {
      id: `NOTIF-${Date.now()}`,
      type: 'New Officer Onboarded',
      title: 'New Officer Onboarded',
      message: `${newOfficer.name} appointed as ${newOfficer.designation} (${newOfficer.department}, ${newOfficer.district}).`,
      timestamp: new Date().toISOString(),
      read: false,
      priority: 'MEDIUM',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newOfficer;
  };

  const getParcel = (parcelId: string) => {
    return parcels.find((p) => p.parcelId === parcelId);
  };

  const getFile = (fileId: string) => {
    return files.find((f) => f.fileId === fileId);
  };

  const addAuditLog = (
    action: string,
    parcelId?: string,
    fileId?: string,
    previousStatus?: string,
    newStatus?: string,
    remarks?: string
  ) => {
    const entry: AuditLog = {
      id: `AUD-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      user: currentUser.name,
      role: currentUser.role,
      action,
      fileId,
      parcelId,
      previousStatus,
      newStatus,
      remarks: remarks || `${action} executed by ${currentUser.name} (${currentUser.role})`,
    };
    setAuditLogs((prev) => [entry, ...prev]);
  };

  const addNotification = (
    type: AppNotification['type'],
    title: string,
    message: string,
    parcelId?: string,
    fileId?: string,
    priority: 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM'
  ) => {
    const newNotif: AppNotification = {
      id: `NOTIF-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      type,
      title,
      message,
      parcelId,
      fileId,
      read: false,
      priority,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Recalculate Risk transparently based on current factors
  const recalculateRisk = (parcelId: string) => {
    setParcels((prev) =>
      prev.map((p) => {
        if (p.parcelId !== parcelId) return p;

        const parcelDocs = documents.filter((d) => d.parcelId === parcelId);
        const parcelTasks = tasks.filter((t) => t.parcelId === parcelId);
        const parcelFile = files.find((f) => f.parcelId === parcelId);

        let score = 0;
        const reasons: string[] = [];

        // Check missing documents (+2)
        const hasMissing = parcelDocs.some((d) => d.status === 'MISSING');
        if (hasMissing) {
          score += 2;
          reasons.push('Missing essential statutory acquisition documents');
        }

        // Check document mismatch (+3)
        const hasMismatch = parcelDocs.some(
          (d) => d.mismatches && d.mismatches.length > 0 && d.status !== 'VERIFIED'
        );
        if (hasMismatch) {
          score += 3;
          reasons.push('Unresolved document data mismatch detected');
        }

        // Overdue tasks (+2)
        const hasOverdue = parcelTasks.some(
          (t) => t.status === 'DELAYED' || (t.delayDays > 0 && t.status !== 'COMPLETED')
        );
        if (hasOverdue) {
          score += 2;
          reasons.push('Workflow tasks currently overdue');
        }

        // Due date approaching / overdue on file (+2)
        if (parcelFile && new Date(parcelFile.dueDate).getTime() - Date.now() < 3 * 86400000) {
          score += 2;
          reasons.push('Stage completion deadline approaching or passed');
        }

        // Active dispute (+3)
        if (p.dispute && p.dispute.status !== 'RESOLVED') {
          score += 3;
          reasons.push(`Active judicial dispute (${p.dispute.courtOrForum})`);
        }

        // File returned (+2)
        if (parcelFile && parcelFile.status === 'RETURNED') {
          score += 2;
          reasons.push('File recently returned with pending deficiency resolution');
        }

        const riskLevel: Parcel['riskLevel'] = score >= 6 ? 'HIGH' : score >= 3 ? 'MEDIUM' : 'LOW';

        return {
          ...p,
          riskScore: score,
          riskLevel,
          riskReasons: reasons,
          lastUpdated: new Date().toISOString(),
        };
      })
    );
  };

  // ACCEPT FILE: Moves status from SENT to UNDER_REVIEW, updates active queue
  const acceptFile = async (fileId: string, remarks?: string) => {
    const file = files.find((f) => f.fileId === fileId);
    if (!file) return;

    const previousStatus = file.status;
    const newStatus = 'UNDER_REVIEW';

    const step: FileMovementStep = {
      stepId: `MOV-${Date.now().toString().slice(-6)}`,
      fromOfficer: file.previousOfficer || file.currentOfficer,
      fromDepartment: file.previousDepartment || file.currentDepartment,
      toOfficer: currentUser.name + ` (${currentUser.role})`,
      toDepartment: currentUser.department,
      timestamp: new Date().toISOString(),
      status: 'ACCEPTED',
      purpose: `${currentUser.role} formally accepted file for active processing.`,
      remarks: remarks || 'File received intact; review commenced.',
    };

    setFiles((prev) =>
      prev.map((f) => {
        if (f.fileId !== fileId) return f;
        return {
          ...f,
          status: newStatus,
          currentOfficer: currentUser.name + ` (${currentUser.role})`,
          currentDepartment: currentUser.department,
          movementHistory: [step, ...f.movementHistory],
        };
      })
    );

    addAuditLog('ACCEPT_FILE', file.parcelId, fileId, previousStatus, newStatus, remarks);
    addNotification(
      'File Accepted',
      `File ${fileId} Accepted`,
      `${currentUser.name} (${currentUser.role}) has accepted File ${fileId} into Active Files.`,
      file.parcelId,
      fileId,
      'MEDIUM'
    );
  };

  // REJECT / RETURN FILE: Sends file back to previous officer with reason & correction requirement
  const returnFile = async (
    fileId: string,
    payload: {
      reasonCategory: string;
      remarks: string;
      requiredCorrection: string;
      returnToOfficer?: string;
      returnToDept?: string;
    }
  ) => {
    const file = files.find((f) => f.fileId === fileId);
    if (!file) return;

    const returnTargetOfficer = payload.returnToOfficer || file.previousOfficer || 'Ashok Kumar Meena (District Officer)';
    const returnTargetDept = payload.returnToDept || file.previousDepartment || 'District Revenue Office';

    const step: FileMovementStep = {
      stepId: `MOV-${Date.now().toString().slice(-6)}`,
      fromOfficer: currentUser.name + ` (${currentUser.role})`,
      fromDepartment: currentUser.department,
      toOfficer: returnTargetOfficer,
      toDepartment: returnTargetDept,
      timestamp: new Date().toISOString(),
      status: 'RETURNED',
      purpose: `File Returned: ${payload.reasonCategory}`,
      remarks: payload.remarks,
      returnReason: payload.reasonCategory,
      requiredCorrection: payload.requiredCorrection,
    };

    setFiles((prev) =>
      prev.map((f) => {
        if (f.fileId !== fileId) return f;
        return {
          ...f,
          status: 'RETURNED',
          previousOfficer: currentUser.name + ` (${currentUser.role})`,
          previousDepartment: currentUser.department,
          currentOfficer: returnTargetOfficer,
          currentDepartment: returnTargetDept,
          returnReasonCategory: payload.reasonCategory,
          returnRemarks: payload.remarks,
          requiredCorrection: payload.requiredCorrection,
          movementHistory: [step, ...f.movementHistory],
        };
      })
    );

    // Increase parcel risk due to return
    setParcels((prev) =>
      prev.map((p) => {
        if (p.parcelId !== file.parcelId) return p;
        return {
          ...p,
          riskLevel: 'HIGH',
          riskScore: Math.min(10, p.riskScore + 2),
          riskReasons: Array.from(new Set([...p.riskReasons, `File returned by ${currentUser.role}: ${payload.reasonCategory}`])),
          lastUpdated: new Date().toISOString(),
        };
      })
    );

    addAuditLog(
      'RETURN_FILE',
      file.parcelId,
      fileId,
      file.status,
      'RETURNED',
      `Reason: ${payload.reasonCategory} | Required Correction: ${payload.requiredCorrection}`
    );

    addNotification(
      'File Returned',
      `Action Required: File ${fileId} Returned`,
      `Returned by ${currentUser.name} (${currentUser.role}). Reason: ${payload.reasonCategory}. Correction: ${payload.requiredCorrection}`,
      file.parcelId,
      fileId,
      'HIGH'
    );
  };

  // RESUBMIT FILE: Previous officer sends corrected file back to receiving officer
  const resubmitFile = async (fileId: string, payload: { remarks: string }) => {
    const file = files.find((f) => f.fileId === fileId);
    if (!file) return;

    // Send back to the officer who returned it (stored in previousOfficer)
    const nextOfficer = file.previousOfficer || 'R.K. Sharma (Finance Officer)';
    const nextDept = file.previousDepartment || 'District Finance';

    const step: FileMovementStep = {
      stepId: `MOV-${Date.now().toString().slice(-6)}`,
      fromOfficer: currentUser.name + ` (${currentUser.role})`,
      fromDepartment: currentUser.department,
      toOfficer: nextOfficer,
      toDepartment: nextDept,
      timestamp: new Date().toISOString(),
      status: 'SENT',
      purpose: 'Deficiency resolved. Resubmitted for processing.',
      remarks: payload.remarks,
    };

    setFiles((prev) =>
      prev.map((f) => {
        if (f.fileId !== fileId) return f;
        return {
          ...f,
          status: 'SENT',
          previousOfficer: currentUser.name + ` (${currentUser.role})`,
          previousDepartment: currentUser.department,
          currentOfficer: nextOfficer,
          currentDepartment: nextDept,
          returnReasonCategory: undefined,
          returnRemarks: undefined,
          requiredCorrection: undefined,
          movementHistory: [step, ...f.movementHistory],
        };
      })
    );

    addAuditLog('RESUBMIT_FILE', file.parcelId, fileId, 'RETURNED', 'SENT', payload.remarks);

    addNotification(
      'New File Received',
      `File ${fileId} Resubmitted`,
      `${currentUser.name} resolved deficiencies and resubmitted File ${fileId}.`,
      file.parcelId,
      fileId,
      'HIGH'
    );
  };

  // FORWARD FILE: Hand off to downstream department
  const forwardFile = async (
    fileId: string,
    payload: {
      nextOfficer: string;
      nextDepartment: string;
      purpose: string;
      remarks?: string;
      dueDate?: string;
    }
  ) => {
    const file = files.find((f) => f.fileId === fileId);
    if (!file) return;

    const step: FileMovementStep = {
      stepId: `MOV-${Date.now().toString().slice(-6)}`,
      fromOfficer: currentUser.name + ` (${currentUser.role})`,
      fromDepartment: currentUser.department,
      toOfficer: payload.nextOfficer,
      toDepartment: payload.nextDepartment,
      timestamp: new Date().toISOString(),
      status: 'FORWARDED',
      purpose: payload.purpose,
      remarks: payload.remarks,
      dueDate: payload.dueDate,
    };

    setFiles((prev) =>
      prev.map((f) => {
        if (f.fileId !== fileId) return f;
        return {
          ...f,
          status: 'SENT',
          previousOfficer: currentUser.name + ` (${currentUser.role})`,
          previousDepartment: currentUser.department,
          currentOfficer: payload.nextOfficer,
          currentDepartment: payload.nextDepartment,
          movementHistory: [step, ...f.movementHistory],
        };
      })
    );

    addAuditLog('FORWARD_FILE', file.parcelId, fileId, file.status, 'SENT', `Forwarded to ${payload.nextOfficer}: ${payload.purpose}`);

    addNotification(
      'File Forwarded',
      `File ${fileId} Forwarded`,
      `Forwarded to ${payload.nextOfficer} for ${payload.purpose}`,
      file.parcelId,
      fileId,
      'MEDIUM'
    );
  };

  // Document verification & mismatch resolution
  const verifyDocument = async (docId: string, status: DocumentStatus, remarks?: string) => {
    const doc = documents.find((d) => d.id === docId);
    if (!doc) return;

    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id !== docId) return d;
        return {
          ...d,
          status,
          verifiedBy: currentUser.name + ` (${currentUser.role})`,
          verifiedDate: new Date().toISOString(),
          remarks: remarks || d.remarks,
        };
      })
    );

    addAuditLog('VERIFY_DOCUMENT', doc.parcelId, undefined, doc.status, status, remarks);
    recalculateRisk(doc.parcelId);
  };

  const resolveDocumentMismatch = async (docId: string, resolvedAreaHa: number, remarks: string) => {
    const doc = documents.find((d) => d.id === docId);
    if (!doc) return;

    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id !== docId) return d;
        return {
          ...d,
          status: 'VERIFIED',
          verifiedBy: currentUser.name + ` (${currentUser.role})`,
          verifiedDate: new Date().toISOString(),
          remarks: `Mismatch reconciled to ${resolvedAreaHa} ha: ${remarks}`,
          mismatches: [], // Cleared!
          extractedData: d.extractedData ? { ...d.extractedData, areaHa: resolvedAreaHa } : undefined,
        };
      })
    );

    // Update parcel area if reconciled
    setParcels((prev) =>
      prev.map((p) => {
        if (p.parcelId !== doc.parcelId) return p;
        const newReasons = p.riskReasons.filter((r) => !r.toLowerCase().includes('document mismatch') && !r.toLowerCase().includes('area'));
        const newScore = Math.max(0, p.riskScore - 3);
        return {
          ...p,
          area: resolvedAreaHa,
          riskScore: newScore,
          riskLevel: newScore >= 6 ? 'HIGH' : newScore >= 3 ? 'MEDIUM' : 'LOW',
          riskReasons: newReasons,
          delayDays: Math.max(0, p.delayDays - 2),
          status: p.status === 'DELAYED' && newScore < 4 ? 'IN_PROGRESS' : p.status,
          lastUpdated: new Date().toISOString(),
        };
      })
    );

    addAuditLog('RESOLVE_MISMATCH', doc.parcelId, undefined, 'UNDER_VERIFICATION', 'VERIFIED', remarks);
    addNotification(
      'Document Mismatch',
      `Document Mismatch Resolved on ${doc.parcelId}`,
      `Reconciled area to ${resolvedAreaHa} ha by ${currentUser.name}. Risk level recalculated.`,
      doc.parcelId,
      undefined,
      'LOW'
    );
  };

  // Complete Survey action in Survey Portal
  const completeSurvey = async (parcelId: string, evidenceRemarks: string) => {
    const parcel = parcels.find((p) => p.parcelId === parcelId);
    if (!parcel) return;

    // Advance Stage 2 (Survey) to COMPLETED, Stage 3 to IN_PROGRESS
    setParcels((prev) =>
      prev.map((p) => {
        if (p.parcelId !== parcelId) return p;
        const updatedStages = p.stages.map((stg) => {
          if (stg.stageNumber === 2) {
            return {
              ...stg,
              status: 'COMPLETED' as const,
              completedDate: new Date().toISOString().split('T')[0],
              remarks: evidenceRemarks,
            };
          }
          if (stg.stageNumber === 3) {
            return {
              ...stg,
              status: 'IN_PROGRESS' as const,
              startDate: new Date().toISOString().split('T')[0],
            };
          }
          return stg;
        });

        const completedCount = updatedStages.filter((s) => s.status === 'COMPLETED').length;
        const newProgress = Number(((completedCount / 11) * 100).toFixed(1));

        return {
          ...p,
          currentStage: 'Ownership Verification',
          currentOfficer: 'Ashok Kumar Meena (District Officer)',
          currentDepartment: 'District Revenue Office',
          progress: newProgress,
          delayDays: 0,
          status: 'IN_PROGRESS',
          stages: updatedStages,
          lastUpdated: new Date().toISOString(),
        };
      })
    );

    // Forward file to District Revenue Officer as INCOMING FILE (SENT)
    const file = files.find((f) => f.parcelId === parcelId);
    if (file) {
      await forwardFile(file.fileId, {
        nextOfficer: 'Ashok Kumar Meena (District Officer)',
        nextDepartment: 'District Revenue Office',
        purpose: 'Survey completed and DGPS coordinates certified. Forwarded for Ownership Verification.',
        remarks: evidenceRemarks,
      });
    }

    addAuditLog('COMPLETE_SURVEY', parcelId, file?.fileId, 'IN_PROGRESS', 'COMPLETED', evidenceRemarks);
    addNotification(
      'File Forwarded',
      `Survey Completed for ${parcelId}`,
      `Cadastral survey finalized and certified by ${currentUser.name}. File moved to District Revenue Office.`,
      parcelId,
      file?.fileId,
      'LOW'
    );
  };

  const updateTaskStatus = async (taskId: string, status: TaskStatus, delayReason?: string, remarks?: string) => {
    const task = tasks.find((t) => t.taskId === taskId);
    if (!task) return;

    setTasks((prev) =>
      prev.map((t) => {
        if (t.taskId !== taskId) return t;
        return {
          ...t,
          status,
          delayReason: delayReason || t.delayReason,
          remarks: remarks || t.remarks,
          completedDate: status === 'COMPLETED' ? new Date().toISOString().split('T')[0] : t.completedDate,
          delayDays: status === 'COMPLETED' ? 0 : t.delayDays,
        };
      })
    );

    addAuditLog('UPDATE_TASK', task.parcelId, undefined, task.status, status, remarks || delayReason);
    recalculateRisk(task.parcelId);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  // AI Copilot Query Engine with grounded domain intelligence
  const askAiCopilot = async (prompt: string, parcelId?: string): Promise<string> => {
    const p = parcelId ? parcels.find((item) => item.parcelId === parcelId) : undefined;
    const file = p ? files.find((f) => f.parcelId === p.parcelId) : undefined;
    const pDocs = p ? documents.filter((d) => d.parcelId === p.parcelId) : [];
    const pTasks = p ? tasks.filter((t) => t.parcelId === p.parcelId) : [];

    const lowerPrompt = prompt.toLowerCase();

    // Contextual responses grounded in exact data
    if (p) {
      if (lowerPrompt.includes('why') && (lowerPrompt.includes('delayed') || lowerPrompt.includes('delay'))) {
        return `### DELAY ROOT-CAUSE ANALYSIS: PARCEL ${p.parcelId}
- **Current Stage**: ${p.currentStage}
- **Delay Duration**: ${p.delayDays} days overdue
- **Department Responsible**: ${p.currentDepartment} (${p.currentOfficer})
- **Stated Ground Reason**: ${p.delayReason || 'Administrative queue backlog during inter-departmental scrutiny.'}

**Identified Friction Point**:
The file has been retained at ${p.currentStage} due to pending validation of data discrepancies. Under the statutory workflow, downstream stages (${p.stages.slice(p.stages.findIndex(s => s.name === p.currentStage) + 1).map(s => s.name).join(' → ')}) cannot commence until this clearance is issued.

*Decision support only. Final administrative/legal decisions remain with authorized officials.*`;
      }

      if (lowerPrompt.includes('risk') || lowerPrompt.includes('cause')) {
        return `### RISK ASSESSMENT BREAKDOWN: PARCEL ${p.parcelId}
- **Composite Risk Rating**: **${p.riskLevel}** (Risk Score: ${p.riskScore}/10)
- **Primary Risk Determinants**:
${p.riskReasons.map((r, i) => `  ${i + 1}. ${r}`).join('\n')}
- **Active Digital File Status**: ${file?.status || 'Active'} with ${file?.currentOfficer || p.currentOfficer}

**Mitigation Recommendation**:
1. Reconcile documented areas with village revenue map (Naksha Trace).
2. Schedule expedited inter-departmental review meeting between District Revenue Office and Treasury.

*Decision support only. Final administrative/legal decisions remain with authorized officials.*`;
      }

      if (lowerPrompt.includes('who') || lowerPrompt.includes('officer') || lowerPrompt.includes('where is the file')) {
        return `### DIGITAL FILE CUSTODY: PARCEL ${p.parcelId}
- **File Identifier**: ${p.digitalFileId}
- **Current Custodian**: ${p.currentOfficer}
- **Department**: ${p.currentDepartment}
- **Current File Status**: **${file?.status || 'UNDER_REVIEW'}**
- **Received On**: ${file ? new Date(file.receivedDate).toLocaleDateString() : 'Recent'}
- **Statutory Due Date**: ${file ? new Date(file.dueDate).toLocaleDateString() : 'N/A'}
- **Prior Department**: ${file?.previousDepartment || 'District Revenue Office'} (${file?.previousOfficer || 'District Officer'})

*Decision support only. Final administrative/legal decisions remain with authorized officials.*`;
      }

      if (lowerPrompt.includes('document') || lowerPrompt.includes('missing') || lowerPrompt.includes('mismatch')) {
        const mismatches = pDocs.flatMap((d) => d.mismatches || []);
        return `### DOCUMENTARY AUDIT: PARCEL ${p.parcelId}
- **Total Uploaded Documents**: ${pDocs.length}
- **Verified**: ${pDocs.filter((d) => d.status === 'VERIFIED').length}
- **Pending Review**: ${pDocs.filter((d) => d.status === 'UNDER_VERIFICATION').length}
- **Missing**: ${pDocs.filter((d) => d.status === 'MISSING').length}

${
  mismatches.length > 0
    ? `⚠️ **CRITICAL MISMATCH DETECTED**:
${mismatches
  .map(
    (m) =>
      `• Field: **${m.field}**\n  - Document Value: ${m.documentValue}\n  - Database Value: ${m.databaseValue}\n  - Discrepancy: ${m.discrepancy}`
  )
  .join('\n')}`
    : 'No documentary value discrepancies detected.'
}

*Decision support only. Final administrative/legal decisions remain with authorized officials.*`;
      }

      // General summary of case
      return `### CASE SUMMARY: PARCEL ${p.parcelId} (Khasra ${p.khasraNumber})
- **Project**: ${p.project}
- **Location**: Village ${p.village}, Tehsil ${p.tehsil}, District ${p.district}
- **Land Area**: ${p.area} Hectares (${p.ownerType})
- **Workflow Progression**: **${p.progress}%**
  • Completed Stages: ${p.stages.filter((s) => s.status === 'COMPLETED').length} / 11
  • Current Stage: **${p.currentStage}** (${p.status})
- **Current Custodian**: ${p.currentOfficer} (${p.currentDepartment})
- **Risk Score**: ${p.riskScore} (${p.riskLevel} Risk)
${p.delayDays > 0 ? `- **Delay**: ${p.delayDays} days overdue (${p.delayReason})` : '- **Schedule**: On track'}

**Suggested Next Action**:
${
  p.currentStage === 'Compensation Approval'
    ? 'Verify physical deed area discrepancy against village Jamabandi before treasury disbursement authorization.'
    : p.currentStage === 'Survey'
    ? 'Complete boundary monumentation and submit certified cadastral DGPS coordinate book.'
    : 'Proceed with scheduled statutory verification and forward to downstream officer.'
}

*Decision support only. Final administrative/legal decisions remain with authorized officials.*`;
    }

    // High level project / platform question
    const delayedCount = parcels.filter((x) => x.status === 'DELAYED').length;
    const highRiskCount = parcels.filter((x) => x.riskLevel === 'HIGH').length;
    const disputedCount = parcels.filter((x) => x.status === 'DISPUTED').length;

    return `### NATIONAL ACQUISITION INTELLIGENCE BRIEFING
- **Monitored Parcels**: ${parcels.length} across ${projects.length} major infrastructure projects.
- **Critical Friction Points**:
  1. **Delayed Cases**: ${delayedCount} parcels currently exceeding statutory SLAs.
  2. **High Risk Cases**: ${highRiskCount} parcels flagged for documentary discrepancies or litigation.
  3. **Judicial Injunctions**: ${disputedCount} parcels subject to High Court or revenue court stay orders.
- **Top Bottleneck Department**: District Finance & Compensation Approval, followed by Cadastral Survey.

Select any specific parcel (e.g. **P-1024**) or ask about a specific district or stage to retrieve granular diagnostics.

*Decision support only. Final administrative/legal decisions remain with authorized officials.*`;
  };

  const resetToDemoState = () => {
    localStorage.removeItem(`${STORAGE_KEY}_users`);
    localStorage.removeItem(`${STORAGE_KEY}_auth`);
    localStorage.removeItem(`${STORAGE_KEY}_current_user`);
    localStorage.removeItem(`${STORAGE_KEY}_parcels`);
    localStorage.removeItem(`${STORAGE_KEY}_files`);
    localStorage.removeItem(`${STORAGE_KEY}_tasks`);
    localStorage.removeItem(`${STORAGE_KEY}_documents`);
    localStorage.removeItem(`${STORAGE_KEY}_audit`);
    localStorage.removeItem(`${STORAGE_KEY}_notifications`);
    setAllUsers(DEMO_USERS);
    setIsAuthenticated(true);
    setParcels(SEED_PARCELS);
    setFiles(SEED_FILES);
    setTasks(SEED_TASKS);
    setDocuments(SEED_DOCUMENTS);
    setAuditLogs(SEED_AUDIT_LOGS);
    setNotifications(SEED_NOTIFICATIONS);
    setCurrentUser(DEMO_USERS[0]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allUsers,
        projects,
        parcels,
        files,
        tasks,
        documents,
        auditLogs,
        notifications,
        isAuthenticated,
        login,
        logout,
        registerUser,
        validateCredentials,
        verifyOfficerPin,
        updateOfficerPassword,
        updateOfficerPin,
        sessionTimeoutMinutes,
        setSessionTimeoutMinutes,
        addOfficer,
        switchUser,
        getParcel,
        getFile,
        acceptFile,
        returnFile,
        forwardFile,
        resubmitFile,
        verifyDocument,
        resolveDocumentMismatch,
        updateTaskStatus,
        completeSurvey,
        markNotificationRead,
        recalculateRisk,
        askAiCopilot,
        resetToDemoState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
