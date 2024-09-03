"use client";

import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import CsvUpload from "@/components/fileupload";
import { useRouter } from "next/navigation";

export default function Home() {
  const { toast } = useToast();
  const router = useRouter();
  const handleFileUpload = async (file: File) => {
    console.log("clicked");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/v1/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast({
          variant: "success",
          title: "CSV File uploaded successfully ",
          description: "Wait for the processed CSV file in your inbox!",
          action: <ToastAction altText="success button">cancel</ToastAction>,
        });
        router.refresh();
      } else {
        toast({
          variant: "destructive",
          title: "Sorry, Failed to upload your file ",
          description: "Please try uploading the file again",
          action: <ToastAction altText="try again">Try again</ToastAction>,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sorry, Failked to upload your file ",
        description: "Please try uploading the file again",
        action: <ToastAction altText="try again">Try again</ToastAction>,
      });
      console.error("Error uploading file:", error);
    }
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
        <p className="rounded-2xl bg-gray-200 hover:bg-gray-100 cursor-pointer transition px-4 py-1.5 text-sm font-medium">
          👋Hi Yoshi!
        </p>
        <h1 className="font-sans text-balance font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
          Upload Your CSV file{" "}
          <span className="cursor-pointer hover:translate-y-3 hover:shadow-xl">
            📁
          </span>
        </h1>
        <p className="max-w-[42rem] mt-5 leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Drop the CSV file here and wait for the result to be droped in your
          inbox.{" "}
        </p>
          <p className="rounded-2xl bg-gray-200 font-bold transition px-4 py-1.5 text-sm mb-3">
            Avg. waiting time is 5.5 minutes
          </p>
        <div>
          <CsvUpload onFileUpload={handleFileUpload} />
        </div>
      </div>
    </main>
  );
}
