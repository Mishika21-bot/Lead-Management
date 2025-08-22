type Column = { key: string, label: string };
type Section = { title: string, columns: Column[], data: any[] };

function escapeCSV(cell: any): string {
    if (cell === null || cell === undefined) {
        return '';
    }
    let cellString = String(cell);
    if (cellString.includes('"') || cellString.includes(',') || cellString.includes('\\n')) {
        cellString = `"${cellString.replace(/"/g, '""')}"`;
    }
    return cellString;
}

export function convertDataToCSV(sections: Section[]): string {
    let csvString = '';

    sections.forEach(section => {
        if (!section.data || section.data.length === 0) {
            return;
        }

        // Section Title
        csvString += `"${section.title}"\\n`;

        // Section Header
        const header = section.columns.map(c => c.label).join(',') + '\\n';
        csvString += header;

        // Section Rows
        const rows = section.data.map(row => {
            return section.columns.map(col => {
                return escapeCSV(row[col.key]);
            }).join(',');
        }).join('\\n');
        csvString += rows;

        // Add blank lines for separation
        csvString += '\\n\\n';
    });

    return csvString;
}
