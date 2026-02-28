import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { DoseLog } from '../hooks/useDoses';

/**
 * historyExportService
 * Handles the generation and sharing of medication adherence reports.
 * Supports PDF and CSV formats for medical record keeping and doctor consultations.
 */
export const historyExportService = {
    /**
     * Generates a styled HTML string for the PDF report.
     * Includes branding, adherence statistics, and a detailed dose breakdown.
     * @param {DoseLog[]} doses - Array of dose logs to include in the report.
     * @param {string} userName - Name of the user for the report header.
     * @param {Object} [options] - Optional parameters for filtering and metadata.
     * @returns {string} Fully structured HTML content.
     */
    generateHTML(
        doses: DoseLog[],
        userName: string,
        options?: {
            startDate?: Date;
            endDate?: Date;
            medications?: { id: string; name: string; dosage: string }[];
            userInfo?: { email?: string; age?: number };
        }
    ) {
        const startDate = options?.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const endDate = options?.endDate || new Date();

        // Filter doses by date range
        const filteredDoses = doses.filter(dose => {
            const doseDate = new Date(dose.scheduledTime);
            return doseDate >= startDate && doseDate <= endDate;
        });

        // Calculate statistics
        const totalDoses = filteredDoses.length;
        const takenDoses = filteredDoses.filter(d => d.status === 'taken').length;
        const missedDoses = filteredDoses.filter(d => d.status === 'missed').length;
        const snoozedDoses = filteredDoses.filter(d => d.status === 'snoozed').length;
        const adherence = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 0;

        // Medication breakdown
        const medBreakdown = options?.medications?.map(med => {
            const medDoses = filteredDoses.filter(d => d.medicationId === med.id);
            const medTaken = medDoses.filter(d => d.status === 'taken').length;
            const medAdherence = medDoses.length > 0 ? Math.round((medTaken / medDoses.length) * 100) : 0;
            return {
                name: med.name,
                dosage: med.dosage,
                total: medDoses.length,
                taken: medTaken,
                adherence: medAdherence
            };
        }).filter(m => m && m.total > 0) || [];

        return `
            <html>
            <head>
                <style>
                    body { font-family: 'Helvetica', sans-serif; padding: 20px; color: #333; }
                    .header { background: linear-gradient(135deg, #10D9A5 0%, #0FA88C 100%); color: white; padding: 30px; border-radius: 10px; margin-bottom: 30px; }
                    .header h1 { margin: 0 0 10px 0; font-size: 32px; }
                    .header p { margin: 5px 0; opacity: 0.9; }
                    .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 30px; }
                    .info-card { background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #10D9A5; }
                    .info-card label { font-size: 12px; color: #666; text-transform: uppercase; font-weight: bold; }
                    .info-card value { font-size: 18px; color: #333; font-weight: bold; display: block; margin-top: 5px; }
                    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 30px; }
                    .stat-card { background: #fff; border: 2px solid #e0e0e0; border-radius: 10px; padding: 20px; text-align: center; }
                    .stat-value { font-size: 36px; font-weight: bold; color: #10D9A5; margin-bottom: 5px; }
                    .stat-label { font-size: 14px; color: #666; text-transform: uppercase; }
                    .section-title { font-size: 20px; font-weight: bold; color: #333; margin: 30px 0 15px 0; border-bottom: 2px solid #10D9A5; padding-bottom: 10px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; font-size: 14px; }
                    th { background-color: #f2f2f2; font-weight: bold; }
                    .status-taken { color: #10D9A5; font-weight: bold; }
                    .status-missed { color: #FF5252; font-weight: bold; }
                    .status-snoozed { color: #FFA000; font-weight: bold; }
                    .med-breakdown { background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
                    .med-breakdown-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
                    .med-name { font-weight: bold; font-size: 16px; }
                    .med-adherence { font-size: 18px; font-weight: bold; color: #10D9A5; }
                    .progress-bar { height: 8px; background: #e0e0e0; border-radius: 4px; overflow: hidden; margin-bottom: 5px; }
                    .progress-fill { height: 100%; background: #10D9A5; }
                    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #888; text-align: center; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Medication Adherence Report</h1>
                    <p>Generated by Pillara</p>
                    <p>${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div class="info-grid">
                    <div class="info-card">
                        <label>Patient Name</label>
                        <value>${userName}</value>
                    </div>
                    ${options?.userInfo?.email ? `
                    <div class="info-card">
                        <label>Email</label>
                        <value>${options.userInfo.email}</value>
                    </div>
                    ` : ''}
                    <div class="info-card">
                        <label>Report Period</label>
                        <value>${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}</value>
                    </div>
                </div>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-value">${adherence}%</div>
                        <div class="stat-label">Adherence</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" style="color: #10D9A5;">${takenDoses}</div>
                        <div class="stat-label">Taken</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" style="color: #FF5252;">${missedDoses}</div>
                        <div class="stat-label">Missed</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" style="color: #FFA000;">${snoozedDoses}</div>
                        <div class="stat-label">Snoozed</div>
                    </div>
                </div>
                ${medBreakdown.length > 0 ? `
                    <div class="section-title">Medication Breakdown</div>
                    ${medBreakdown.map(med => `
                        <div class="med-breakdown">
                            <div class="med-breakdown-header">
                                <div>
                                    <div class="med-name">${med.name}</div>
                                    <div style="font-size: 14px; color: #666;">${med.dosage}</div>
                                </div>
                                <div class="med-adherence">${med.adherence}%</div>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${med.adherence}%;"></div>
                            </div>
                        </div>
                    `).join('')}
                ` : ''}
                <div class="section-title">Dose History</div>
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Medication</th>
                            <th>Scheduled Time</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredDoses.slice(0, 50).map(dose => `
                            <tr>
                                <td>${new Date(dose.scheduledTime).toLocaleDateString()}</td>
                                <td>${dose.medicationName}</td>
                                <td>${new Date(dose.scheduledTime).toLocaleTimeString()}</td>
                                <td class="status-${dose.status}">${dose.status.toUpperCase()}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="footer">
                    <p>This report is for informational purposes only and should not replace professional medical advice.</p>
                    <p>Generated by Pillara - Your Smart Medication Management Guide</p>
                </div>
            </body>
            </html>
        `;
    },

    /**
     * Generates a PDF file from dose history and opens the system share sheet.
     * @param {DoseLog[]} doses - Dose history logs.
     * @param {string} userName - User's display name.
     * @param {Object} [options] - Filtering options (startDate, endDate, etc).
     * @returns {Promise<string>} The local file URI of the generated PDF.
     * @throws {Error} If PDF generation or sharing fails.
     */
    async exportToPDF(
        doses: DoseLog[],
        userName: string,
        options?: any
    ) {
        try {
            const htmlContent = this.generateHTML(doses, userName, options);
            const { uri } = await Print.printToFileAsync({ html: htmlContent });

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
            } else {
                alert('Sharing is not available on this device');
            }

            return uri;
        } catch (error) {
            console.error('Error exporting PDF:', error);
            throw new Error('Failed to generate PDF report');
        }
    },

    /**
     * Preview report using native print dialog
     */
    async printReport(
        doses: DoseLog[],
        userName: string,
        options?: any
    ) {
        try {
            const htmlContent = this.generateHTML(doses, userName, options);
            await Print.printAsync({ html: htmlContent });
        } catch (error) {
            console.error('Error previewing PDF:', error);
        }
    },

    /**
     * Exports dose history to a CSV file and opens the system share sheet.
     * @param {DoseLog[]} doses - Dose history logs to export.
     * @returns {Promise<void>}
     * @throws {Error} If file writing or sharing fails.
     */
    async exportToCSV(doses: DoseLog[]) {
        try {
            const headers = ['Medication', 'Scheduled Time', 'Status', 'Notes'];
            const rows = doses.map(dose => [
                dose.medicationName,
                new Date(dose.scheduledTime).toISOString(),
                dose.status,
                dose.notes || ''
            ]);

            const csvContent = [
                headers.join(','),
                ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
            ].join('\n');

            const fileUri = `${FileSystem.cacheDirectory}pillara_history_${Date.now()}.csv`;
            await FileSystem.writeAsStringAsync(fileUri, csvContent, { encoding: FileSystem.EncodingType.UTF8 });

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri, { mimeType: 'text/csv', dialogTitle: 'Export Dose History' });
            } else {
                alert('Sharing is not available on this device');
            }
        } catch (error) {
            console.error('Error exporting CSV:', error);
            throw new Error('Failed to generate CSV report');
        }
    }
};
