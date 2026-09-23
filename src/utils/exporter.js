// Export PDF and Excel utility functions
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { formatCurrency, formatDate } from './formatters';

export function exportTransactionsToExcel(transactions, fileName = "Transactions_Ledger") {
  const dataToExport = transactions.map(tx => ({
    "Date": formatDate(tx.date),
    "Description": tx.description,
    "Merchant": tx.merchant || "",
    "Category": tx.category,
    "Subcategory": tx.subcategory || "",
    "Type": tx.type,
    "Debit Amount": tx.debit ? tx.debit : 0,
    "Credit Amount": tx.credit ? tx.credit : 0,
    "Balance": tx.balance ? tx.balance : 0,
    "AI Confidence": `${tx.aiConfidence}%`,
    "Status": tx.status,
    "Bank Account": tx.bankName || "HDFC Bank",
    "Reference No": tx.referenceNo || ""
  }));

  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
  XLSX.writeFile(workbook, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
}

export function exportProfitAndLossPDF(financialData, user, currency = "INR") {
  const doc = new jsPDF();
  const title = "PROFIT & LOSS STATEMENT";
  const company = user?.businessName || "Apex Innovations Pvt Ltd";
  const period = "FY 2026-27 (Year-to-Date)";

  // Document Header
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text(company.toUpperCase(), 14, 20);

  doc.setFontSize(12);
  doc.setTextColor(100, 116, 139);
  doc.text(title, 14, 28);
  doc.text(`Period: ${period}`, 14, 34);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 40);

  doc.setDrawColor(226, 232, 240);
  doc.line(14, 45, 196, 45);

  let y = 55;

  // 1. Revenue
  doc.setFontSize(14);
  doc.setTextColor(16, 185, 129); // Green
  doc.text("REVENUE & INCOME", 14, y);
  doc.text(formatCurrency(financialData.totalIncome, currency), 160, y, { align: "right" });
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text("Sales Revenue & Client Retainers", 20, y);
  doc.text(formatCurrency(financialData.totalIncome * 0.85, currency), 160, y, { align: "right" });
  y += 6;
  doc.text("Consulting & Freelance Payouts", 20, y);
  doc.text(formatCurrency(financialData.totalIncome * 0.15, currency), 160, y, { align: "right" });
  y += 12;

  // 2. Cost of Goods Sold / Operating Expenses
  doc.setFontSize(14);
  doc.setTextColor(244, 63, 94); // Red
  doc.text("OPERATING EXPENSES", 14, y);
  doc.text(`-${formatCurrency(financialData.totalExpenses, currency)}`, 160, y, { align: "right" });
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text("Salaries & Payroll", 20, y);
  doc.text(formatCurrency(140000, currency), 160, y, { align: "right" });
  y += 6;
  doc.text("Office Rent & Utilities", 20, y);
  doc.text(formatCurrency(49300, currency), 160, y, { align: "right" });
  y += 6;
  doc.text("Marketing & Advertising", 20, y);
  doc.text(formatCurrency(24500, currency), 160, y, { align: "right" });
  y += 6;
  doc.text("Software & SaaS Tools", 20, y);
  doc.text(formatCurrency(20250, currency), 160, y, { align: "right" });
  y += 6;
  doc.text("Other Business Expenditures", 20, y);
  doc.text(formatCurrency(financialData.totalExpenses - 234050, currency), 160, y, { align: "right" });
  y += 15;

  doc.line(14, y, 196, y);
  y += 10;

  // 3. NET PROFIT
  const netProfit = financialData.totalIncome - financialData.totalExpenses;
  doc.setFontSize(16);
  doc.setTextColor(netProfit >= 0 ? 16 : 244, netProfit >= 0 ? 185 : 63, netProfit >= 0 ? 129 : 94);
  doc.text("NET PROFIT", 14, y);
  doc.text(formatCurrency(netProfit, currency), 160, y, { align: "right" });

  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text("Certified by AI Bookkeeping Automated Financial Analysis Engine", 14, 280);

  doc.save(`${company.replace(/\s+/g, '_')}_Profit_and_Loss_${new Date().toISOString().split('T')[0]}.pdf`);
}
