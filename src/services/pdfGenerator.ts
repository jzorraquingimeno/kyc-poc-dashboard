import jsPDF from 'jspdf';

interface Finding {
  category: string;
  riskAssessment: string;
  score: number;
  evidenceSources: Array<{
    title: string;
    link: string;
    snippet: string;
  }>;
}

interface CompanyInfo {
  legalName: string;
  kvkNumber: string;
  address?: string;
  sbiDescription?: string;
  legalForm?: string;
}

export const generateInvestigationReportPDF = (
  companyInfo: CompanyInfo,
  findings: Finding[],
  conclusion: string,
  riskClassification: string
) => {
  const doc = new jsPDF();
  let yPosition = 20;
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);

  // Helper function to add text with word wrapping
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 12): number => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + (lines.length * fontSize * 0.4);
  };

  // Helper function to check if we need a new page
  const checkPageBreak = (requiredSpace: number): number => {
    if (yPosition + requiredSpace > doc.internal.pageSize.height - 20) {
      doc.addPage();
      return 20;
    }
    return yPosition;
  };

  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('OPEN-SOURCE INVESTIGATION REPORT', margin, yPosition);
  yPosition += 15;

  // Company name
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(companyInfo.legalName, margin, yPosition);
  yPosition += 10;

  // Meta information
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`KVK: ${companyInfo.kvkNumber}`, margin, yPosition);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - margin - 50, yPosition);
  yPosition += 20;

  // Introduction Section
  yPosition = checkPageBreak(40);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('COMPANY INTRODUCTION', margin, yPosition);
  yPosition += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  let introText = `This report provides a comprehensive open-source investigation analysis for ${companyInfo.legalName} (KVK: ${companyInfo.kvkNumber}).`;
  
  if (companyInfo.address) {
    introText += ` The company is registered at ${companyInfo.address}.`;
  }
  
  if (companyInfo.legalForm) {
    introText += ` Legal form: ${companyInfo.legalForm}.`;
  }
  
  if (companyInfo.sbiDescription) {
    introText += ` Primary business activity: ${companyInfo.sbiDescription}.`;
  }

  introText += ' The investigation covers six key risk categories: Geographical Risk, Industry Risk, Structure Risk, Adverse Media Risk, Sanctions Risk, and Politically Exposed Person (PEP) Risk.';

  yPosition = addWrappedText(introText, margin, yPosition, contentWidth, 11);
  yPosition += 15;

  // Conclusion Section
  yPosition = checkPageBreak(60);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('CONCLUSION', margin, yPosition);
  yPosition += 5;

  // Risk Classification Badge
  doc.setFillColor(220, 220, 220);
  doc.rect(pageWidth - margin - 80, yPosition - 3, 75, 15, 'F');
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`RISK: ${riskClassification.toUpperCase()}`, pageWidth - margin - 77, yPosition + 6);
  yPosition += 20;

  // Conclusion text
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  yPosition = addWrappedText(conclusion, margin, yPosition, contentWidth - 85, 11);
  yPosition += 20;

  // Findings Section
  yPosition = checkPageBreak(40);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('FINDINGS', margin, yPosition);
  yPosition += 15;

  findings.forEach((finding, index) => {
    // Check if we need space for the finding (estimate 80 units)
    yPosition = checkPageBreak(80);

    // Risk Category Header
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(finding.category, margin, yPosition);
    
    // Score badge
    doc.setFillColor(70, 130, 180);
    doc.rect(pageWidth - margin - 40, yPosition - 8, 35, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text(`SCORE: ${finding.score}/10`, pageWidth - margin - 37, yPosition - 2);
    doc.setTextColor(0, 0, 0);
    yPosition += 10;

    // Divider line
    doc.setDrawColor(134, 188, 37);
    doc.setLineWidth(1);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    // Risk Assessment
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('RISK ASSESSMENT:', margin, yPosition);
    yPosition += 6;

    doc.setFont('helvetica', 'normal');
    yPosition = addWrappedText(finding.riskAssessment, margin, yPosition, contentWidth, 10);
    yPosition += 8;

    // Evidence Sources
    doc.setFont('helvetica', 'bold');
    doc.text('EVIDENCE SOURCES:', margin, yPosition);
    yPosition += 6;

    finding.evidenceSources.forEach((source, sourceIndex) => {
      yPosition = checkPageBreak(25);
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      yPosition = addWrappedText(`Source Document / Concept: ${source.title}`, margin + 5, yPosition, contentWidth - 10, 9);
      yPosition += 3;

      doc.setFont('helvetica', 'italic');
      yPosition = addWrappedText(`"${source.snippet}"`, margin + 5, yPosition, contentWidth - 10, 9);
      yPosition += 3;

      if (source.link !== '#') {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 255);
        yPosition = addWrappedText(`Link: ${source.link}`, margin + 5, yPosition, contentWidth - 10, 9);
        doc.setTextColor(0, 0, 0);
      }
      
      yPosition += 5;
    });

    yPosition += 10;
  });

  // Footer on last page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 20, doc.internal.pageSize.height - 10);
    doc.text('ABN AMRO - Open Source Investigation Report', margin, doc.internal.pageSize.height - 10);
  }

  // Save the PDF
  doc.save(`${companyInfo.legalName.replace(/[^a-zA-Z0-9]/g, '_')}_Investigation_Report.pdf`);
};