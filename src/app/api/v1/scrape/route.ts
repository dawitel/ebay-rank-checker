import axios from "axios";
import fs from "fs";
import { NextResponse } from "next/server";
import Papa from "papaparse";

export async function POST(req: Request) {
  try {
    const { filePath } = await req.json();

    // Read and parse the CSV file
    const csvData = fs.readFileSync(filePath, "utf-8");
    const parsedData = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
    });

    console.log("Parsed data: ", parsedData.data[0]);
    // scraping logic will go in here...

    const finalData = parsedData;
    try {
      const url = "http://localhost:3000/api/v1/send";
      const response = await axios.post(
        url,
        { finalData },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status != 200) {
        return NextResponse.json(
          {
            message: "Failed to send the data to the email sender",
          },
          { status: 500 }
        );
      }
      console.log("Response:", response.data);
    } catch (error: any) {
      console.error("🔴Error occurred:", error);
      console.error("🔴Response data:", error.response.data); // Log server response
    }

    return NextResponse.json(
      {
        message: "File sent to the user email successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("🔴Error occurred:", error);
    return NextResponse.json(
      { error: "Failed to send the final data content to the email sender" },
      { status: 500 }
    );
  }
}
