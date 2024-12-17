import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Reservation } from '../types/reservation';

interface ExportFilters {
  dateRange: 'all' | 'custom' | 'month';
  startDate: string;
  endDate: string;
  status: Reservation['status'] | 'all';
}

interface ReservationAnalysis {
  totalReservations: number;
  byStatus: {
    pending: number;
    confirmed: number;
    cancelled: number;
  };
  byDayOfWeek: {
    [key: string]: number;
  };
  byTimeSlot: {
    lunch: number;
    dinner: number;
  };
  averageGuests: number;
  mostCommonSize: number;
  totalGuests: number;
}

// Colores corporativos
const COLORS = {
  primary: [130, 13, 14],    // #820D0E
  secondary: [51, 51, 51],   // #333333
  accent: [200, 160, 120],   // #C8A078
  light: [255, 255, 255],    // #FFFFFF
  gray: [102, 102, 102]      // #666666
};

function analyzeReservations(reservations: Reservation[]): ReservationAnalysis {
  const analysis: ReservationAnalysis = {
    totalReservations: reservations.length,
    byStatus: {
      pending: 0,
      confirmed: 0,
      cancelled: 0
    },
    byDayOfWeek: {},
    byTimeSlot: {
      lunch: 0,
      dinner: 0
    },
    averageGuests: 0,
    mostCommonSize: 0,
    totalGuests: 0
  };

  const guestSizeCounts: { [key: number]: number } = {};

  reservations.forEach(reservation => {
    // Por estado
    analysis.byStatus[reservation.status]++;

    // Por día de la semana
    const [year, month, day] = reservation.date.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const dayName = format(date, 'EEEE', { locale: es });
    analysis.byDayOfWeek[dayName] = (analysis.byDayOfWeek[dayName] || 0) + 1;

    // Por horario
    const hour = parseInt(reservation.time.split(':')[0]);
    if (hour < 16) {
      analysis.byTimeSlot.lunch++;
    } else {
      analysis.byTimeSlot.dinner++;
    }

    // Análisis de invitados
    analysis.totalGuests += reservation.guests;
    guestSizeCounts[reservation.guests] = (guestSizeCounts[reservation.guests] || 0) + 1;
  });

  // Calcular promedio de invitados
  analysis.averageGuests = analysis.totalGuests / (analysis.totalReservations || 1);

  // Encontrar el tamaño más común de grupo
  let maxCount = 0;
  Object.entries(guestSizeCounts).forEach(([size, count]) => {
    if (count > maxCount) {
      maxCount = count;
      analysis.mostCommonSize = parseInt(size);
    }
  });

  return analysis;
}

export const exportReservationsToPDF = (reservations: Reservation[], filters: ExportFilters) => {
  const doc = new jsPDF();
  const analysis = analyzeReservations(reservations);
  let currentY = 20;
  const margin = 15;
  const pageWidth = doc.internal.pageSize.width;
  
  // Funciones auxiliares
  const addSpacer = (height: number) => {
    currentY += height;
  };

  const drawLine = () => {
    doc.setDrawColor(...COLORS.accent);
    doc.setLineWidth(0.5);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    addSpacer(10);
  };

  // Header con logo y título
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(...COLORS.light);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('TREGUA RESTAURANT', pageWidth / 2, 20, { align: 'center' });
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Reporte de Reservas', pageWidth / 2, 32, { align: 'center' });

  currentY = 60;

  // Información del reporte
  doc.setTextColor(...COLORS.secondary);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const reportInfo = [
    `Generado el: ${format(new Date(), "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}`,
    `Período: ${filters.dateRange === 'all' ? 'Todas las fechas' : 
      filters.dateRange === 'month' ? 'Mes actual' : 
      `${format(new Date(filters.startDate), "d 'de' MMMM, yyyy", { locale: es })} al ${format(new Date(filters.endDate), "d 'de' MMMM, yyyy", { locale: es })}`}`,
    `Estado: ${filters.status === 'all' ? 'Todos' : 
      filters.status === 'pending' ? 'Pendientes' :
      filters.status === 'confirmed' ? 'Confirmadas' : 'Canceladas'}`
  ];

  reportInfo.forEach(line => {
    doc.text(line, margin, currentY);
    currentY += 6;
  });

  addSpacer(10);
  drawLine();

  // Resumen Ejecutivo
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...COLORS.primary);
  doc.text('Resumen Ejecutivo', margin, currentY);
  addSpacer(15);

  // Grid de estadísticas principales
  const statsGrid = [
    { label: 'Total Reservas', value: analysis.totalReservations.toString() },
    { label: 'Total Comensales', value: analysis.totalGuests.toString() },
    { label: 'Promedio por Reserva', value: analysis.averageGuests.toFixed(1) },
    { label: 'Grupo más Común', value: `${analysis.mostCommonSize} personas` }
  ];

  const gridWidth = (pageWidth - (2 * margin)) / 2;
  const gridHeight = 25;
  
  statsGrid.forEach((stat, index) => {
    const x = margin + (index % 2) * gridWidth;
    const y = currentY + Math.floor(index / 2) * gridHeight;
    
    doc.setFillColor(...COLORS.accent, 0.1);
    doc.roundedRect(x, y, gridWidth - 5, gridHeight - 5, 3, 3, 'F');
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.gray);
    doc.text(stat.label, x + 5, y + 7);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...COLORS.primary);
    doc.text(stat.value, x + 5, y + 18);
  });

  currentY += 55;
  drawLine();

  // Análisis por Estado
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...COLORS.primary);
  doc.text('Distribución por Estado', margin, currentY);
  addSpacer(10);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendientes': return [255, 170, 0];  // Naranja
      case 'Confirmadas': return [0, 150, 0];   // Verde
      case 'Canceladas': return [200, 0, 0];    // Rojo
      default: return COLORS.secondary;
    }
  };

  autoTable(doc, {
    startY: currentY,
    head: [['Estado', 'Cantidad', 'Porcentaje']],
    body: [
      ['Pendientes', analysis.byStatus.pending, `${((analysis.byStatus.pending / analysis.totalReservations) * 100).toFixed(1)}%`],
      ['Confirmadas', analysis.byStatus.confirmed, `${((analysis.byStatus.confirmed / analysis.totalReservations) * 100).toFixed(1)}%`],
      ['Canceladas', analysis.byStatus.cancelled, `${((analysis.byStatus.cancelled / analysis.totalReservations) * 100).toFixed(1)}%`]
    ],
    theme: 'grid',
    headStyles: {
      fillColor: COLORS.primary,
      textColor: COLORS.light,
      fontSize: 12,
      fontStyle: 'bold',
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 11,
      textColor: COLORS.secondary,
      halign: 'center'
    },
    columnStyles: {
      0: { fontStyle: 'bold' }
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250]
    }
  });

  // Actualizar la posición Y actual
  currentY = (doc as any).lastAutoTable.finalY + 20;

  // Análisis por Día y Horario
  doc.addPage(); // Nueva página para las distribuciones
  currentY = 60; // Empezar después del header

  // Header de la nueva página
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(...COLORS.light);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Análisis de Distribución', pageWidth / 2, 25, { align: 'center' });

  // Distribución por Día
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...COLORS.primary);
  doc.text('Distribución por Día', margin, currentY);
  
  const dayData = Object.entries(analysis.byDayOfWeek)
    .sort((a, b) => b[1] - a[1]) // Ordenar por cantidad descendente
    .map(([day, count]) => [
      day,
      count,
      `${((count / analysis.totalReservations) * 100).toFixed(1)}%`
    ]);

  autoTable(doc, {
    startY: currentY + 10,
    head: [['Día', 'Cantidad', 'Porcentaje']],
    body: dayData,
    theme: 'grid',
    headStyles: {
      fillColor: COLORS.primary,
      textColor: COLORS.light,
      fontSize: 11,
      fontStyle: 'bold',
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 10,
      textColor: COLORS.secondary,
      halign: 'center'
    },
    columnStyles: {
      0: { fontStyle: 'bold' }
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250]
    },
    margin: { left: margin, right: margin },
    tableWidth: pageWidth - (2 * margin)
  });

  // Actualizar posición Y para la siguiente tabla
  currentY = (doc as any).lastAutoTable.finalY + 30;

  // Distribución por Horario
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...COLORS.primary);
  doc.text('Distribución por Horario', margin, currentY);

  autoTable(doc, {
    startY: currentY + 10,
    head: [['Horario', 'Cantidad', 'Porcentaje']],
    body: [
      ['Almuerzo', analysis.byTimeSlot.lunch, `${((analysis.byTimeSlot.lunch / analysis.totalReservations) * 100).toFixed(1)}%`],
      ['Cena', analysis.byTimeSlot.dinner, `${((analysis.byTimeSlot.dinner / analysis.totalReservations) * 100).toFixed(1)}%`]
    ],
    theme: 'grid',
    headStyles: {
      fillColor: COLORS.primary,
      textColor: COLORS.light,
      fontSize: 11,
      fontStyle: 'bold',
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 10,
      textColor: COLORS.secondary,
      halign: 'center'
    },
    columnStyles: {
      0: { fontStyle: 'bold' }
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250]
    },
    margin: { left: margin, right: margin },
    tableWidth: pageWidth - (2 * margin)
  });

  // Lista detallada de reservas
  doc.addPage();
  currentY = 50;

  // Header de la nueva página
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(...COLORS.light);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Lista Detallada de Reservas', pageWidth / 2, 25, { align: 'center' });

  // Ordenar reservas por fecha y hora
  const sortedReservations = [...reservations].sort((a, b) => {
    const dateA = new Date(a.date + 'T' + a.time);
    const dateB = new Date(b.date + 'T' + b.time);
    return dateB.getTime() - dateA.getTime();
  });

  const tableData = sortedReservations.map(reservation => {
    const [year, month, day] = reservation.date.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    
    return [
      format(date, "d 'de' MMMM, yyyy", { locale: es }),
      reservation.time,
      reservation.name,
      reservation.email,
      reservation.phone,
      `${reservation.guests} personas`,
      reservation.status === 'pending' ? 'Pendiente' :
      reservation.status === 'confirmed' ? 'Confirmada' : 'Cancelada'
    ];
  });

  autoTable(doc, {
    startY: currentY,
    head: [['Fecha', 'Hora', 'Nombre', 'Email', 'Teléfono', 'Personas', 'Estado']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: COLORS.primary,
      textColor: COLORS.light,
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 9,
      textColor: COLORS.secondary,
      halign: 'left'
    },
    columnStyles: {
      0: { cellWidth: 35, halign: 'center' }, // Fecha
      1: { cellWidth: 20, halign: 'center' }, // Hora
      2: { cellWidth: 30 }, // Nombre
      3: { cellWidth: 40 }, // Email
      4: { cellWidth: 25, halign: 'center' }, // Teléfono
      5: { cellWidth: 20, halign: 'center' }, // Personas
      6: { cellWidth: 25, halign: 'center' } // Estado
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250]
    },
    margin: { left: margin, right: margin },
    didDrawPage: function (data) {
      // Header en cada página
      doc.setFillColor(...COLORS.primary);
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setTextColor(...COLORS.light);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Lista Detallada de Reservas', pageWidth / 2, 25, { align: 'center' });

      // Pie de página
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.gray);
      doc.setFont('helvetica', 'normal');
      const pageNumber = `Página ${data.pageNumber} de ${data.pageCount}`;
      doc.text('Tregua Restaurant - Sistema de Gestión de Reservas', margin, doc.internal.pageSize.height - 10);
      doc.text(pageNumber, pageWidth - margin - doc.getTextWidth(pageNumber), doc.internal.pageSize.height - 10);
    }
  });

  // Guardar el PDF
  doc.save(`Reporte_Reservas_Tregua_${format(new Date(), "yyyy-MM-dd", { locale: es })}.pdf`);
} 