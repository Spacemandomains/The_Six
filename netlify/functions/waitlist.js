const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyLoLLmj-q_ytVXasrLKvdjP7PPbzcY4YY09Rdq-OxfxhgucW81BPzDAbOoGrDGKBJg/exec";

const baseHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

exports.handler = async (event) => {
  try {
    // CORS preflight
    if (event.httpMethod === "OPTIONS") {
      return { statusCode: 204, headers: baseHeaders, body: "" };
    }

    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        headers: baseHeaders,
        body: JSON.stringify({ status: "error", message: "Method Not Allowed" }),
      };
    }

    const { email } = JSON.parse(event.body || "{}");
    const cleanEmail = String(email || "").trim().toLowerCase();

    if (!cleanEmail) {
      return {
        statusCode: 400,
        headers: baseHeaders,
        body: JSON.stringify({ status: "error", message: "Email required" }),
      };
    }

    const resp = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ email: cleanEmail, source: "WAITLIST" }),
    });

    const upstreamText = await resp.text();

    if (!resp.ok) {
      return {
        statusCode: 502,
        headers: baseHeaders,
        body: JSON.stringify({
          status: "error",
          message: "Apps Script error",
          upstreamStatus: resp.status,
          upstreamBody: upstreamText.slice(0, 300),
        }),
      };
    }

    return {
      statusCode: 200,
      headers: baseHeaders,
      body: JSON.stringify({ status: "ok" }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: baseHeaders,
      body: JSON.stringify({
        status: "error",
        message: err?.message || "Server error",
      }),
    };
  }
};
