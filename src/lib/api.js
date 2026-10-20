export const API_URL = "https://69b30b45e224ec066bdb55a0.mockapi.io/api/v1/cdr";

function toBoolean(value) {
  return value === true || value === "true";
}

function normaliseCall(record) {
  return {
    id: String(record.id),
    callerName: record.callerName ?? "Unknown",
    callerNumber: record.callerNumber ?? "",
    receiverNumber: record.receiverNumber ?? "",
    city: record.city || "Unknown",
    inbound: toBoolean(record.callDirection),
    successful: toBoolean(record.callStatus),
    duration: Number(record.callDuration) || 0,
    cost: Number.parseFloat(record.callCost) || 0,
    start: new Date(record.callStartTime),
    end: new Date(record.callEndTime),
  };
}

export async function fetchCalls(signal) {
  const response = await fetch(API_URL, { signal });
  if (!response.ok) {
    throw new Error(`The CDR API responded with status ${response.status}.`);
  }
  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error("The CDR API returned data in an unexpected format.");
  }
  return data.map(normaliseCall).filter((call) => !Number.isNaN(call.start.getTime()));
}
