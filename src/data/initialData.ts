import { ExeatPass, GateLog, StudentUser } from '../types';

export const initialStudentUsers: StudentUser[] = [
  {
    id: "USER-210101001",
    studentName: "Samuel Araoyinbo",
    matricNo: "210101001",
    level: "300 Level",
    courseOfStudy: "B.Sc. Computer Science",
    hallName: "Faith Hall",
    studentPhone: "08031234567",
    parentPhone: "08029876543",
    password: "password123",
    createdAt: new Date().toISOString(),
  },
  {
    id: "USER-220102045",
    studentName: "Grace Olusola",
    matricNo: "220102045",
    level: "200 Level",
    courseOfStudy: "B.Sc. Mass Communication",
    hallName: "Grace Hall",
    studentPhone: "08145550192",
    parentPhone: "08093338811",
    password: "password123",
    createdAt: new Date().toISOString(),
  }
];

export const initialPasses: ExeatPass[] = [
  {
    id: "CRU-CS-8921",
    studentName: "Samuel Araoyinbo",
    matricNo: "210101001",
    hallName: "Faith Hall",
    studentPhone: "+234 803 123 4567",
    parentPhone: "+234 802 987 6543",
    reason: "Medical Appointment & Family Emergency",
    depDate: "2026-09-18",
    returnDate: "2026-09-20",
    letterNote: "Dear Student Affairs, I am requesting permission to travel home to attend a specialist medical consultation in Lagos scheduled for Friday morning, accompanied by my parent.",
    status: "Approved",
    createdAt: new Date().toISOString(),
    approvedBy: "Dr. O. A. Student Affairs (CRU-CS)",
  },
  {
    id: "CRU-CS-4412",
    studentName: "Grace Olusola",
    matricNo: "220102045",
    hallName: "Grace Hall",
    studentPhone: "+234 814 555 0192",
    parentPhone: "+234 809 333 8811",
    reason: "Academic Seminar Attendance",
    depDate: "2026-09-19",
    letterNote: "Application for weekend exeat clearance to participate in the National Youth Engineering Summit.",
    attachmentName: "Summit_Invitation_Letter.pdf",
    status: "Pending",
    createdAt: new Date().toISOString(),
  }
];

export const initialGateLogs: GateLog[] = [
  {
    id: "LOG-001",
    passId: "CRU-CS-8921",
    studentName: "Samuel Araoyinbo",
    matricNo: "210101001",
    hallName: "Faith Hall",
    timestamp: new Date().toISOString(),
    action: "CHECK_OUT",
    verifiedBy: "CRU-CS Security Main Gate Desk",
  }
];
