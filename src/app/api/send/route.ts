import { EmailTemplate } from "@/components/email-template";
import { Resend } from "resend";
import * as React from "react";
import { json2csv } from "json-2-csv";
import { NextResponse } from "next/server";
import { promisify } from "util";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    // Convert the json2csv function to return a promise
    const json2csvAsync = promisify(json2csv);
    const { fileJSONContent } = await req.json();

    if (!fileJSONContent) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const jsonData = JSON.parse(fileJSONContent);

    // Convert JSON to CSV using json-2-csv
    let csvData: any;
    try {
      csvData = await json2csvAsync(jsonData, {});
    } catch (error) {
      return NextResponse.json(
        { message: "Error converting JSON to CSV" },
        { status: 500 }
      );
    }

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
