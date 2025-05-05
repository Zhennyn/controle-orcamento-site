
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function generatePDF(elementId: string, filename: string = 'orcamento.pdf') {
  try {
    // Get the element that we want to convert to PDF
    const element = document.getElementById(elementId);
    
    if (!element) {
      throw new Error('Element not found');
    }
    
    // Create a clone to avoid modifying the original element
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.width = '794px'; // A4 width in pixels at 96 DPI
    clone.style.padding = '30px';
    
    // Temporarily append to the document to render but make it invisible
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    document.body.appendChild(clone);

    // Use html2canvas to render the element
    const canvas = await html2canvas(clone, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // Allow images from other domains
      logging: false,
      backgroundColor: '#ffffff'
    });
    
    // Remove the clone from the document
    document.body.removeChild(clone);

    // PDF dimensions (A4 format)
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Convert the canvas to PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    
    // Save the PDF
    pdf.save(filename);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
}
