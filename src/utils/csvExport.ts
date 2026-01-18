export const exportToCSV = <T extends Record<string, any>>(
  data: T[],
  filename: string,
  columns?: { key: keyof T; header: string }[]
) => {
  if (data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // If columns are specified, use them; otherwise, use all keys from the first object
  const headers = columns
    ? columns.map((col) => col.header)
    : Object.keys(data[0]);

  const keys = columns
    ? columns.map((col) => col.key as string)
    : Object.keys(data[0]);

  // Create CSV header row
  const csvHeader = headers.join(',');

  // Create CSV data rows
  const csvRows = data.map((row) => {
    return keys
      .map((key) => {
        let value = row[key];

        // Handle nested objects (like customer.name or product.name)
        if (key.includes('.')) {
          const parts = key.split('.');
          value = parts.reduce((obj, part) => obj?.[part], row);
        }

        // Handle different value types
        if (value === null || value === undefined) {
          return '';
        }

        // Convert to string and escape quotes
        const stringValue = String(value).replace(/"/g, '""');

        // Wrap in quotes if contains comma, newline, or quote
        if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
          return `"${stringValue}"`;
        }

        return stringValue;
      })
      .join(',');
  });

  // Combine header and rows
  const csvContent = [csvHeader, ...csvRows].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
