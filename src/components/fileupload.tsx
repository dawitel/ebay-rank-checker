import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ToastAction } from "@radix-ui/react-toast";

interface CsvUploadProps {
  onFileUpload: (file: File) => void;
}

const CsvUpload: React.FC<CsvUploadProps> = ({ onFileUpload }) => {
  const { toast } = useToast();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/csv") {
      setSelectedFile(file);
    } else {
      toast({
        variant: "destructive",
        title: "The file you're trying to upload is not supported!",
        description: "Try uploading a CSV file",
        action: (
          <ToastAction altText="cancel">Cancel</ToastAction>
        ),
      });
    }
  };

  const handleUploadClick = () => {
    if (selectedFile) {
      onFileUpload(selectedFile);
    } else {
      toast({
        variant: "destructive",
        title: "Please select a file to upload!",
        description: "Try uploading a CSV file",
      });
    }
  };

  return (
    <div className="flex space-x-4">
      <Input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="bg-slate-200 h-9.5 text-slate-900"
      />
      <Button
        onClick={handleUploadClick}
        className="bg-blue-500 hover:bg-blue-500 hover:text-gray-200 text-white px-4 py-2 rounded"
      >
        Upload CSV File
      </Button>
    </div>
  );
};

export default CsvUpload;
