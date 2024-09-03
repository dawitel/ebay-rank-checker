import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import axios from "axios";

const uploadDir = path.join(process.cwd(), "uploads");

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
  }

  const filePath = path.join(uploadDir, file.name);

  // Ensure the upload directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  // Save the file
  const fileStream = fs.createWriteStream(filePath);
  // Convert the file's ReadableStream to a Node.js stream
  const reader = file.stream().getReader();
  const writer = fileStream;

  // Pipe the ReadableStream to the Node.js writable stream
  await new Promise<void>((resolve, reject) => {
    const pump = async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          writer.end();
          resolve();
          break;
        }
        writer.write(value);
      }
    };
    pump().catch(reject);
  });
  try {
    const url = "http://localhost:3000/api/v1/scrape";
    const response = await axios.post(url, {
      filePath,
    });
    if (response.status != 200) {
      return NextResponse.json(
        { message: "Failed to send file path" },
        { status: 500 }
      );
    }
    return NextResponse.json({
      message: "File path sent successfully",
    });
  } catch (error) {
    console.log("🔴Failed to send the file path: ", error);
  }

  return NextResponse.json({
    message: "File uploaded successfully",
  });
}
