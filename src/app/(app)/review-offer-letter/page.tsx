"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  CheckIcon,
  Edit3Icon,
  FileSearch2Icon,
  InfoIcon,
  Loader2Icon,
  TrendingUpIcon,
  TriangleAlertIcon,
  UploadCloud,
} from "lucide-react";
import { API_URL } from "@/lib/constants";

interface IApiResponse {
  good_policies?: string[];
  policies_to_negotiate?: string[];
  red_flags?: string[];
  missing_benefits_or_points_of_concern?: string[];
  career_growth_opportunities?: string[];
  work_life_balance_insights?: string[];
  final_conclusion?: string;
  error?: string;
}

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [response, setResponse] = useState<IApiResponse | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) setFile(droppedFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setResponse(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_URL}/api/review-offer-letter/`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error(err);
      setResponse({ error: "Upload failed" });
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const div = document.getElementById("response-section");
    if (!div || !response || response.error) return;

    window.scrollTo({
      behavior: "smooth",
      left: 0,
      top: div?.offsetTop || 0,
    });
  }, [response]);

  return (
    <div className="min-h-screen flex flexc justify-center">
      <div className="p-4 lg:p-8 w-full max-w-4xl rounded-2xl mt-10">
        <div className="p-4">
          <h3 className="p-2 text-center text-2xl">Upload Your Offer Letter</h3>
        </div>

        <div>
          {/* Drag and Drop Area */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-10 sm:p-12 md:p-16 text-center transition-colors ${
              dragging ? "border-primary bg-muted" : "border-border bg-muted/30"
            }`}
          >
            <UploadCloud
              className="mx-auto mb-3 text-muted-foreground"
              size={40}
            />
            <p className="text-muted-foreground">
              Drag & drop your offer letter here, or{" "}
              <button
                className="text-[hsl(var(--primary))] underline"
                onClick={() => inputRef.current?.click()}
              >
                browse
              </button>
            </p>
            <input
              type="file"
              ref={inputRef}
              className="hidden"
              accept=".pdf,.docx,.txt"
              onChange={(e) => e.target.files && setFile(e.target.files[0])}
            />
            {file && (
              <p className="mt-3 text-sm text-[hsl(var(--foreground))]">
                {file.name}
              </p>
            )}
          </div>

          {/* Upload Button */}
          <button
            className="w-full px-6 py-2 flex items-center justify-center rounded-md mt-6 bg-primary text-primary-foreground hover:bg-primary/95 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
            onClick={handleUpload}
            disabled={!file || uploading}
          >
            {uploading ? (
              <span className="flex items-center gap-2">
                <Loader2Icon className="animate-spin" /> Analyzing...
              </span>
            ) : (
              "Upload & Analyze"
            )}
          </button>
        </div>

        {/* Response Section */}
        {response && (
          <div
            id="response-section"
            className="bg-popover shadow-xl my-16 px-4 py-8 rounded-2xl space-y-4 text-left"
          >
            {response.error && (
              <div className="p-4 bg-red-100 text-red-800 rounded-lg">
                <h4 className="font-semibold mb-1">Error</h4>
                <p>{response.error}</p>
              </div>
            )}

            {response.good_policies && response.good_policies?.length > 0 && (
              <Section items={response.good_policies} className="">
                <span className="flex items-center gap-4">
                  <CheckIcon /> Good Policies
                </span>
              </Section>
            )}

            {response.policies_to_negotiate &&
              response.policies_to_negotiate?.length > 0 && (
                <Section items={response.policies_to_negotiate}>
                  <Edit3Icon className="p-0.5" /> Policies to Negotiate
                </Section>
              )}

            {response.red_flags && response.red_flags?.length > 0 && (
              <Section items={response.red_flags}>
                <TriangleAlertIcon />
                Red Flags
              </Section>
            )}

            {response.missing_benefits_or_points_of_concern &&
              response.missing_benefits_or_points_of_concern?.length > 0 && (
                <Section items={response.missing_benefits_or_points_of_concern}>
                  <InfoIcon />
                  Missing Benefits or Points of Concern
                </Section>
              )}

            {response.career_growth_opportunities &&
              response.career_growth_opportunities?.length > 0 && (
                <Section items={response.career_growth_opportunities}>
                  <TrendingUpIcon />
                  Career Growth Opportunities
                </Section>
              )}

            {response.work_life_balance_insights &&
              response.work_life_balance_insights?.length > 0 && (
                <Section items={response.work_life_balance_insights}>
                  Work-Life Balance Insights
                </Section>
              )}

            {response.final_conclusion && (
              <div className="p-4">
                <h4 className="font-semibold mb-2 text-primary text-lg flex items-center gap-4 p-2">
                  <FileSearch2Icon />
                  Final Conclusion
                </h4>
                <p className="leading-relaxed px-2">
                  {response.final_conclusion}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Section({
  children,
  items,
  className,
}: {
  children: Readonly<React.ReactNode>;
  items: string[];
  className?: string;
}) {
  return (
    <div className={`p-4 rounded-lg ${className}`}>
      <h4 className="p-2 text-lg font-semibold mb-2 flex items-center gap-4">
        {children}
      </h4>
      <ul className="px-8 list-disc list-inside space-y-1 leading-relaxed">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
