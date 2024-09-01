import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const path = url.pathname;

  if (path.startsWith("/api/scrape")) {
    const scrapeDoUrl = `${process.env.SCRAPE_DO_US_ENDPOINT}/${path.replace(
      "/api/scrape",
      ""
    )}`;
    try {
      const response = await axios({
        method: request.method,
        url: scrapeDoUrl,
        headers: {
          Authorization: `Bearer ${process.env.SCRAPE_DO_API_KEY}`,
          "Content-Type":
            request.headers.get("Content-Type") || "application/json",
        },
        data: request.body ? JSON.parse(request.body.toString()) : undefined,
      });

      return NextResponse.json(response.data);
    } catch (error) {
      console.error("Scrape.do request failed:", error);
      return NextResponse.json(
        { error: "Failed to fetch data" },
        { status: 500 }
      );
    }
  }

  return NextResponse.next();
}
