import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Reservation } from '../types/reservation';

export const exportReservationsToPDF = (reservations: Reservation[]) => {
  const doc = new jsPDF();
  
  // Título
  doc.setFontSize(20);
  doc.text('Reporte de Reservas - Tregua Restaurant', 15, 20);
  
  // Fecha del reporte
  doc.setFontSize(10);
  doc.text(`Generado el: ${format(new Date(), "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}`, 15, 30);
  
  // Estadísticas
  const pendingCount = reservations.filter(r => r.status === 'pending').length;
  const confirmedCount = reservations.filter(r => r.status === 'confirmed').length;
  const cancelledCount = reservations.filter(r => r.status === 'cancelled').length;
  
  doc.setFontSize(12);
  doc.text('Resumen:', 15, 40);
  doc.setFontSize(10);
  doc.text([
    `Total de reservas: ${reservations.length}`,
    `Reservas pendientes: ${pendingCount}`,
    `Reservas confirmadas: ${confirmedCount}`,
    `Reservas canceladas: ${cancelledCount}`
  ], 20, 50);

  // Tabla de reservas
  const tableData = reservations.map(reservation => {
    const [year, month, day] = reservation.date.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    
    return [
      reservation.name,
      format(date, "d 'de' MMMM, yyyy", { locale: es }),
      reservation.time,
      `${reservation.guests} personas`,
      reservation.status === 'pending' ? 'Pendiente' :
      reservation.status === 'confirmed' ? 'Confirmada' : 'Cancelada',
      reservation.email,
      reservation.phone,
      reservation.notes || '-'
    ];
  });

  autoTable(doc, {
    startY: 70,
    head: [['Nombre', 'Fecha', 'Hora', 'Personas', 'Estado', 'Email', 'Teléfono', 'Notas']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [51, 51, 51],
      textColor: [255, 255, 255],
      fontSize: 8
    },
    bodyStyles: {
      fontSize: 8
    },
    columnStyles: {
      0: { cellWidth: 30 }, // Nombre
      1: { cellWidth: 25 }, // Fecha
      2: { cellWidth: 15 }, // Hora
      3: { cellWidth: 15 }, // Personas
      4: { cellWidth: 20 }, // Estado
      5: { cellWidth: 35 }, // Email
      6: { cellWidth: 20 }, // Teléfono
      7: { cellWidth: 30 }  // Notas
    },
    styles: {
      overflow: 'linebreak',
      cellPadding: 2
    },
    didDrawPage: function (data) {
      // Pie de página
      doc.setFontSize(8);
      doc.text(
        'Tregua Restaurant - Sistema de Reservas',
        data.settings.margin.left,
        doc.internal.pageSize.height - 10
      );
      doc.text(
        `Página ${data.pageNumber}`,
        doc.internal.pageSize.width - 20,
        doc.internal.pageSize.height - 10
      );
    }
  });

  // Guardar el PDF
  doc.save('reservas-tregua.pdf');
}; 