import { NextRequest, NextResponse } from "next/server";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const authHeader = req.headers.get("authorization");
  if (authHeader) headers["Authorization"] = authHeader;

  try {
    const res = await fetch(`${API_URL}/orders/${id}/invoice`, { headers });
    const html = await res.text();
    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch invoice" },
      { status: 500 },
    );
  }
}
