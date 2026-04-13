// ... Google sheets parser
export const fetchTickets = async () => {
  const SPREADSHEET_ID = '1B16AalCNPov2j2dVfOxYralgCsP1ra00bmlk3qgbubU';
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=Ticket%20Log`;

  try {
    const res = await fetch(url);
    const text = await res.text();
    // Google Sheets returns a response wrapped in a function call callback(...)
    const jsonString = text.match(/google\.visualization\.Query\.setResponse\((.*)\);/)[1];
    const rawData = JSON.parse(jsonString);

    // Map Google Sheet columns to standardized object
    const tickets = rawData.table.rows.map(row => {
      const getVal = (idx) => row.c[idx] ? row.c[idx].v : null;
      
      return {
        ticket_id: getVal(0),
        timestamp: getVal(1),
        topic: getVal(2),
        urgency: getVal(3),
        sentiment: getVal(4),
        mood: getVal(5),
        escalated: getVal(6) === true || getVal(6) === 'TRUE' || getVal(6) === 'true',
        priority: getVal(7),
        suggested_team: getVal(8),
        message: getVal(9),
        ticket_summary: getVal(10),
        customer_reply: getVal(11),
        response_quality_score: getVal(12),
        quality_notes: getVal(13),
        faq_matched: getVal(14) === true || getVal(14) === 'TRUE' || getVal(14) === 'true',
        faq_answer: getVal(15)
      };
    });

    return tickets;
  } catch (err) {
    console.error("Error fetching tickets array from Google Sheets", err);
    throw err;
  }
};
