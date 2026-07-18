/**
 * Proxy API Route Handler
 * Receives feedback submissions from the browser and forwards them
 * to the Express backend. The browser never sees the backend URL.
 */

export async function POST(request) {
  try {
    const body = await request.json();

    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";

    const response = await fetch(`${backendUrl}/api/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return Response.json(data, { status: response.status });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to submit feedback. Please try again.",
      },
      { status: 500 }
    );
  }
}
