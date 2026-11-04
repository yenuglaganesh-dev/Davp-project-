import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

const EXCEL_FILE_PATH = path.resolve(process.cwd(), 'DAVP_Student_Login_Records.xlsx');
const SHEET_NAME = 'Student_Login_Records';

const HEADERS = [
  'Login ID',
  'Student ID',
  'Student Name',
  'Email',
  'Department',
  'Course',
  'Year of Study',
  'Role',
  'Login Date',
  'Login Time',
  'Login Timestamp',
  'Login Status',
  'Logout Timestamp'
];

const COLUMN_WIDTHS = [28, 18, 24, 28, 32, 24, 18, 14, 16, 16, 28, 16, 28];

// Mutex queue to serialize all file reads/writes safely
let writeQueue = Promise.resolve();

function queueTask(task) {
  const result = writeQueue.then(task);
  writeQueue = result.catch((err) => {
    console.error('[ExcelService] Queue operation error:', err);
  });
  return result;
}

/**
 * Initializes DAVP_Student_Login_Records.xlsx with styled headers
 */
export async function ensureExcelFileExists() {
  if (fs.existsSync(EXCEL_FILE_PATH)) {
    return;
  }

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'DAVP Library Management System';
  workbook.created = new Date();
  
  const sheet = workbook.addWorksheet(SHEET_NAME, {
    views: [{ state: 'frozen', ySplit: 1 }]
  });

  // Add header row
  const headerRow = sheet.addRow(HEADERS);
  headerRow.height = 28;

  headerRow.eachCell((cell, colNumber) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF0A192F' } // Dark Navy
    };
    cell.font = {
      name: 'Segoe UI',
      size: 11,
      bold: true,
      color: { argb: 'FFFFFFFF' }
    };
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center'
    };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF1E293B' } },
      left: { style: 'thin', color: { argb: 'FF1E293B' } },
      bottom: { style: 'medium', color: { argb: 'FF38BDF8' } },
      right: { style: 'thin', color: { argb: 'FF1E293B' } }
    };

    const width = COLUMN_WIDTHS[colNumber - 1] || 20;
    sheet.getColumn(colNumber).width = width;
  });

  await workbook.xlsx.writeFile(EXCEL_FILE_PATH);
  console.log(`[ExcelService] Initialized new workbook at ${EXCEL_FILE_PATH}`);
}

/**
 * Appends a new student login record to DAVP_Student_Login_Records.xlsx
 */
export function recordStudentLogin(studentInfo) {
  return queueTask(async () => {
    await ensureExcelFileExists();

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(EXCEL_FILE_PATH);

    let sheet = workbook.getWorksheet(SHEET_NAME);
    if (!sheet) {
      sheet = workbook.addWorksheet(SHEET_NAME);
      sheet.addRow(HEADERS);
    }

    const now = new Date();
    const loginId = `LOG-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const loginDate = now.toISOString().slice(0, 10);
    const loginTime = now.toTimeString().slice(0, 8);
    const loginTimestamp = now.toISOString();

    const rowData = [
      loginId,
      studentInfo.studentId || 'N/A',
      studentInfo.name || 'Anonymous Student',
      studentInfo.email,
      studentInfo.department || 'Computer Science & Engineering',
      studentInfo.course || 'B.Tech Computer Science',
      studentInfo.yearOfStudy || '3rd Year',
      'student',
      loginDate,
      loginTime,
      loginTimestamp,
      'Success',
      '' // Logout Timestamp initially empty
    ];

    const newRow = sheet.addRow(rowData);
    newRow.height = 22;

    newRow.eachCell((cell, colNumber) => {
      cell.font = { name: 'Segoe UI', size: 10 };
      cell.alignment = {
        vertical: 'middle',
        horizontal: [1, 2, 8, 9, 10, 12].includes(colNumber) ? 'center' : 'left'
      };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
      };

      if (colNumber === 12) {
        cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF059669' } };
      }
    });

    await workbook.xlsx.writeFile(EXCEL_FILE_PATH);
    console.log(`[ExcelService] Appended student login record ${loginId} for ${studentInfo.email}`);

    return {
      loginId,
      loginDate,
      loginTime,
      loginTimestamp,
      loginStatus: 'Success'
    };
  });
}

/**
 * Updates a student login record with logout timestamp upon logout
 */
export function recordStudentLogout(loginId) {
  if (!loginId) return Promise.resolve();

  return queueTask(async () => {
    if (!fs.existsSync(EXCEL_FILE_PATH)) return;

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(EXCEL_FILE_PATH);
    const sheet = workbook.getWorksheet(SHEET_NAME);
    if (!sheet) return;

    const logoutTimestamp = new Date().toISOString();
    let found = false;

    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // skip header
      const cellVal = row.getCell(1).value;
      if (cellVal === loginId) {
        row.getCell(13).value = logoutTimestamp;
        found = true;
      }
    });

    if (found) {
      await workbook.xlsx.writeFile(EXCEL_FILE_PATH);
      console.log(`[ExcelService] Recorded logout for ${loginId} at ${logoutTimestamp}`);
    }
  });
}

/**
 * Reads all student login records from DAVP_Student_Login_Records.xlsx
 */
export function getAllLoginRecords() {
  return queueTask(async () => {
    await ensureExcelFileExists();

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(EXCEL_FILE_PATH);
    const sheet = workbook.getWorksheet(SHEET_NAME);
    if (!sheet) return [];

    const records = [];
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header

      const loginId = String(row.getCell(1).value || '').trim();
      if (!loginId) return;

      records.push({
        loginId,
        studentId: String(row.getCell(2).value || ''),
        name: String(row.getCell(3).value || ''),
        email: String(row.getCell(4).value || ''),
        department: String(row.getCell(5).value || ''),
        course: String(row.getCell(6).value || ''),
        yearOfStudy: String(row.getCell(7).value || ''),
        role: String(row.getCell(8).value || 'student'),
        loginDate: String(row.getCell(9).value || ''),
        loginTime: String(row.getCell(10).value || ''),
        loginTimestamp: String(row.getCell(11).value || ''),
        loginStatus: String(row.getCell(12).value || 'Success'),
        logoutTimestamp: String(row.getCell(13).value || '')
      });
    });

    return records.reverse(); // Most recent logins first
  });
}

/**
 * Returns absolute path of the Excel file
 */
export function getExcelFilePath() {
  return EXCEL_FILE_PATH;
}

/**
 * Exports all login records as CSV string
 */
export async function generateCsvData() {
  const records = await getAllLoginRecords();
  const headers = HEADERS.map(h => `"${h}"`).join(',');
  const rows = records.map(r => [
    `"${r.loginId}"`,
    `"${r.studentId}"`,
    `"${(r.name || '').replace(/"/g, '""')}"`,
    `"${r.email}"`,
    `"${(r.department || '').replace(/"/g, '""')}"`,
    `"${(r.course || '').replace(/"/g, '""')}"`,
    `"${r.yearOfStudy}"`,
    `"${r.role}"`,
    `"${r.loginDate}"`,
    `"${r.loginTime}"`,
    `"${r.loginTimestamp}"`,
    `"${r.loginStatus}"`,
    `"${r.logoutTimestamp}"`
  ].join(','));

  return [headers, ...rows].join('\n');
}
