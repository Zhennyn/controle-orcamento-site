
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generatePDF = async (elementId: string, fileName: string, isFree: boolean = true) => {
  try {
    // Get the element that we want to convert to PDF
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error("Element not found");
    }

    // Create a canvas from the element
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // Enable CORS to load images from external sources
      logging: false, // Disable logging
      backgroundColor: '#ffffff' // Set background color to white
    });

    // Calculate dimensions to maintain aspect ratio
    const imgWidth = 210; // A4 width in mm (210mm)
    const pageHeight = 297; // A4 height in mm (297mm)
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Add the canvas image to PDF
    pdf.addImage(
      canvas.toDataURL('image/png'), 
      'PNG', 
      0, 0, 
      imgWidth, imgHeight
    );
    
    // Add watermark for free plans
    if (isFree) {
      const watermarkText = "ORÇAMENTO GRÁTIS - UPGRADE PARA REMOVER";
      pdf.setTextColor(200, 200, 200); // Light gray color
      pdf.setFontSize(16);
      
      // Add watermark diagonally across the page
      pdf.save();
      pdf.rotate(45, imgWidth / 2, pageHeight / 2);
      pdf.text(watermarkText, 40, pageHeight / 2);
      pdf.restore();
      
      // Add footer watermark
      pdf.setFontSize(10);
      pdf.setTextColor(150, 150, 150);
      pdf.text("Gerado com Budget Blitz - Versão gratuita", imgWidth / 2, pageHeight - 10, { align: 'center' });
    }
    
    // If content is larger than one page, add more pages
    let position = 0;
    let heightLeft = imgHeight;
    
    while (heightLeft >= pageHeight) {
      position = heightLeft - pageHeight;
      pdf.addPage();
      pdf.addImage(
        canvas.toDataURL('image/png'), 
        'PNG', 
        0, -position, 
        imgWidth, imgHeight
      );
      
      // Add watermark on each page for free plans
      if (isFree) {
        const watermarkText = "ORÇAMENTO GRÁTIS - UPGRADE PARA REMOVER";
        pdf.setTextColor(200, 200, 200); // Light gray color
        pdf.setFontSize(16);
        
        pdf.save();
        pdf.rotate(45, imgWidth / 2, pageHeight / 2);
        pdf.text(watermarkText, 40, pageHeight / 2);
        pdf.restore();
        
        pdf.setFontSize(10);
        pdf.setTextColor(150, 150, 150);
        pdf.text("Gerado com Budget Blitz - Versão gratuita", imgWidth / 2, pageHeight - 10, { align: 'center' });
      }
      
      heightLeft -= pageHeight;
    }
    
    // Save the PDF
    pdf.save(`${fileName}.pdf`);
    
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return false;
  }
};
