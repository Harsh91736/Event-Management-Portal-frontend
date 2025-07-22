export const generateCSV = (data, headers) => {
  const csvRows = [];
  const headerRow = headers.map(header => `"${header.label}"`).join(',');
  csvRows.push(headerRow);

  data.forEach(item => {
    const row = headers.map(header => `"${item[header.key] || ''}"`).join(',');
    csvRows.push(row);
  });

  return csvRows.join('\n');
};

export const downloadFile = (content, fileName, type) => {
  const blob = new Blob([content], { type });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

export const formatEventData = (events) => {
  const headers = [
    { key: 'title', label: 'Event Title' },
    { key: 'category', label: 'Category' },
    { key: 'startDate', label: 'Start Date' },
    { key: 'endDate', label: 'End Date' },
    { key: 'venue', label: 'Venue' },
    { key: 'status', label: 'Status' }
  ];

  const formattedData = events.map(event => ({
    ...event,
    startDate: new Date(event.startDate).toLocaleString(),
    endDate: new Date(event.endDate).toLocaleString()
  }));

  return { headers, data: formattedData };
};

export const formatAttendanceData = (attendance) => {
  const headers = [
    { key: 'studentName', label: 'Student Name' },
    { key: 'studentId', label: 'Student ID' },
    { key: 'eventTitle', label: 'Event' },
    { key: 'date', label: 'Date' },
    { key: 'status', label: 'Status' }
  ];

  const formattedData = attendance.map(record => ({
    studentName: record.student.fullName,
    studentId: record.student.studentId,
    eventTitle: record.event.title,
    date: new Date(record.markedAt).toLocaleString(),
    status: record.isPresent ? 'Present' : 'Absent'
  }));

  return { headers, data: formattedData };
};
