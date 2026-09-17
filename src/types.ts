export type ExeatStatus = 'Pending' | 'Approved' | 'Declined' | 'Checked Out' | 'Returned';

export interface StudentUser {
  id: string;
  studentName: string;
  matricNo: string;
  level: string; // e.g. "100 Level", "200 Level", "300 Level", "400 Level", "500 Level"
  courseOfStudy: string; // e.g. "B.Sc. Computer Science", "B.Sc. Mass Communication", etc.
  hallName?: string;
  studentPhone?: string;
  parentPhone?: string;
  password?: string;
  createdAt: string;
}

export interface ExeatPass {
  id: string;
  studentName: string;
  matricNo: string;
  level?: string;
  courseOfStudy?: string;
  hallName: string;
  studentPhone?: string;
  parentPhone?: string;
  reason: string;
  depDate: string;
  returnDate?: string;
  letterNote?: string;
  attachmentName?: string;
  attachmentData?: string;
  status: ExeatStatus;
  createdAt: string;
  approvedBy?: string;
  gateCheckOutTime?: string;
  gateCheckInTime?: string;
}

export interface GateLog {
  id: string;
  passId: string;
  studentName: string;
  matricNo: string;
  hallName: string;
  timestamp: string;
  action: 'CHECK_OUT' | 'CHECK_IN';
  verifiedBy: string;
}
