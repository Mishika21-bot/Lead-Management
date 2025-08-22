/**
 * Converts an array of objects to a CSV string.
 * @param data The array of objects to convert.
 * @returns The CSV string.
 */
export function jsonToCsv(data: any[]): string {
    if (data.length === 0) {
      return '';
    }
  
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
  
    for (const row of data) {
      const values = headers.map(header => {
        let value = row[header];
        if (value === null || value === undefined) {
          value = '';
        } else if (typeof value === 'object') {
          value = JSON.stringify(value);
        }
        // Escape commas and quotes
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      });
      csvRows.push(values.join(','));
    }
  
    return csvRows.join('\n');
}
  
/**
 * Triggers a browser download of a CSV file.
 * @param csv The CSV string to download.
 * @param filename The name of the file to download.
 */
export function downloadCsv(csv: string, filename: string) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}