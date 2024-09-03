import { EmailTemplate } from "@/components/email-template";
import { Resend } from "resend";
import * as React from "react";
import { NextResponse } from "next/server";
import Papa from "papaparse";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { finalData } = await req.json();
    const jsonData =
      typeof finalData === "string" ? JSON.parse(finalData) : finalData;

    if (!jsonData) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const csvData = Papa.unparse(jsonData);
    console.log("✅CSV data: ", csvData);

    // Send email with CSV attachment
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["tranceyos2419@gmail.com"],
      subject: "Hi Yoshi✋! This is the Scraped data from your last upload",
      react: EmailTemplate({ firstName: "Yoshi" }) as React.ReactElement,
      attachments: [
        {
          filename: "final-data.csv",
          content: Buffer.from(csvData).toString("base64"),
          contentType: "text/csv",
        },
      ],
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
