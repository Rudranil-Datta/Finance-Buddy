const NOTES_DELIMITER = '\n---\n';

function buildDescription(title, notes) {
  const trimmedTitle = String(title ?? '').trim() || 'CSV import';
  const trimmedNotes = String(notes ?? '').trim();
  if (!trimmedNotes) return trimmedTitle.slice(0, 200);
  const combined = `${trimmedTitle}${NOTES_DELIMITER}${trimmedNotes}`;
  return combined.slice(0, 200);
}

module.exports = { NOTES_DELIMITER, buildDescription };
