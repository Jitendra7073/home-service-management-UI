import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export default async function generateInvoice(booking: any) {
    const pdf = await PDFDocument.create();
    const page = pdf.addPage([600, 800]);
    const font = await pdf.embedFont(StandardFonts.Helvetica);

    page.drawText("Service Invoice", { x: 200, y: 750, size: 18, font });

    page.drawText(`Service: ${booking.service.name}`, { x: 50, y: 700, size: 12, font });
    page.drawText(`Provider: ${booking.slot.businessProfile.businessName}`, { x: 50, y: 680, size: 12, font });
    page.drawText(`Date: ${new Date(booking.slot.date).toDateString()}`, { x: 50, y: 660, size: 12, font });
    page.drawText(`Price: ${booking.service.price} ${booking.service.currency}`, { x: 50, y: 640, size: 12, font });

    const pdfBytes = await pdf.save();

    const blob = new Blob([pdfBytes], { type: "application/pdf" });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice-${booking.id}.pdf`;
    link.click();
}
