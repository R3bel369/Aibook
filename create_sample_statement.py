from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_sample_bank_statement():
    pdf_filename = "sample_bank_statement.pdf"
    doc = SimpleDocTemplate(pdf_filename, pagesize=letter, leftMargin=36, rightMargin=36, topMargin=36, bottomMargin=36)
    styles = getSampleStyleSheet()
    story = []

    # Title & Header
    title_style = ParagraphStyle(name="HeaderTitle", parent=styles['Heading1'], fontSize=16, leading=20, textColor=colors.HexColor("#0f172a"))
    story.append(Paragraph("APEX TRUST BANK - ACCOUNT STATEMENT", title_style))
    story.append(Paragraph("Account Holder: Eleanor V. Vance | Account: •••• 8492 | Period: Oct 01, 2024 - Oct 31, 2024", styles['Normal']))
    story.append(Spacer(1, 12))

    # 25 transactions distributed across 2 pages (13 on page 1, 12 on page 2)
    raw_tx_data = [
        ["Date", "Reference", "Description", "Debit ($)", "Credit ($)", "Balance ($)"],
        # Page 1 (13 transactions)
        ["2024-10-31", "INT-00102", "Monthly Interest Paid (APY 0.75%)", "", "45.00", "7,118.35"],
        ["2024-10-30", "POS-90184", "CVS Pharmacy Health & Wellness", "12.00", "", "7,073.35"],
        ["2024-10-29", "POS-88412", "Amazon Retail Office Supplies Purchase", "84.50", "", "7,085.35"],
        ["2024-10-28", "POS-12903", "Starbucks Coffee #1920", "14.86", "", "7,169.85"],
        ["2024-10-27", "POS-33120", "Uber Transit - Travel to Client Office", "38.20", "", "7,184.71"],
        ["2024-10-26", "ACH-48190", "Chase Credit Card Auto Payment", "1,650.00", "", "7,222.91"],
        ["2024-10-25", "BP-90123", "Telecom Internet & Mobile Utility", "250.00", "", "8,872.91"],
        ["2024-10-24", "POS-77412", "Target Supercenter Retail Purchase", "88.20", "", "9,122.91"],
        ["2024-10-23", "SUB-99120", "Microsoft 365 Enterprise Suite", "45.00", "", "9,211.11"],
        ["2024-10-22", "ATM-00912", "ATM Cash Withdrawal - Main Branch", "200.00", "", "9,256.11"],
        ["2024-10-21", "POS-55120", "Office Depot Printing & Paper Supplies", "112.40", "", "9,456.11"],
        ["2024-10-20", "POS-33984", "Trader Joe's Groceries Store #22", "96.45", "", "9,568.51"],
        ["2024-10-19", "SUB-10923", "OpenAI ChatGPT Plus Subscription", "20.00", "", "9,664.96"],

        # Page 2 (12 transactions)
        ["2024-10-18", "BP-49021", "ConEdison Electric Utility Bill Payment", "124.30", "", "9,684.96"],
        ["2024-10-17", "POS-44102", "Swiggy Dining Out Team Meal", "64.20", "", "9,809.26"],
        ["2024-10-16", "ACH-91823", "Employer Payroll Direct Deposit - ACME CORP", "", "2,750.00", "9,873.46"],
        ["2024-10-15", "ZLL-88120", "Zelle Transfer Received from Consulting Client", "", "850.00", "7,123.46"],
        ["2024-10-14", "ZLL-55201", "Zelle Transfer Received from Michael Vance", "", "180.00", "6,273.46"],
        ["2024-10-12", "POS-99182", "Shell Fuel Station #4928", "52.10", "", "6,093.46"],
        ["2024-10-11", "SUB-34190", "Netflix Digital Subscription", "19.99", "", "6,145.56"],
        ["2024-10-10", "BP-88120", "Electric Power & Utility Bills", "345.50", "", "6,165.55"],
        ["2024-10-08", "POS-88219", "Shell Fuel Station Petrol", "48.75", "", "6,511.05"],
        ["2024-10-05", "POS-67321", "Whole Foods Market Store #104", "142.60", "", "6,559.80"],
        ["2024-10-03", "EFT-11843", "Mortgage Auto-Debit - Apex Home Loans", "1,450.00", "", "6,702.40"],
        ["2024-10-02", "ACH-90412", "Employer Payroll Direct Deposit - ACME CORP", "", "2,750.00", "8,152.40"]
    ]

    t = Table(raw_tx_data, colWidths=[70, 70, 220, 60, 60, 60])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#1e293b")),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 9),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 6),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
        ('FONTSIZE', (0, 1), (-1, -1), 8),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))

    story.append(t)
    doc.build(story)
    print(f"Generated {pdf_filename} with 25 bank statement transactions across multiple pages.")

if __name__ == "__main__":
    generate_sample_bank_statement()
