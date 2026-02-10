exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { email } = JSON.parse(event.body || "{}");
    if (!email) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "error", message: "Email required" }),
      };
    }

    const APPS_SCRIPT_URL =
      "https://script.google.com/macros/s/AKfycbyLoLLmj-q_ytVXasrLKvdjP7PPbzcY4YY09Rdq-OxfxhgucW81BPzDAbOoGrDGKBJg/exec";

    const resp = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        email: String(email).trim().toLowerCase(),
        source: "WAITLIST",
      }),
    });

    if (!resp.ok) {
      return {
        statusCode: 502,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "error", message: "Apps Script error" }),
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "ok" }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "error", message: err.message }),
    };
  }
};
