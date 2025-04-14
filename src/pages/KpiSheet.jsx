import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const teamMembers = ["Select Team Member", "John Doe", "Jane Smith", "Alex Johnson"];
const months = [
  { label: "April 2025", value: "04-2025" },
  { label: "May 2025", value: "05-2025" },
  { label: "June 2025", value: "06-2025" },
];

export default function KpiSheet() {
  const [formData, setFormData] = useState({});

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const clearData = () => {
    setFormData({});
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex gap-4">
        <select
          className="border p-2 rounded"
          onChange={(e) => handleChange("teamMember", e.target.value)}
          value={formData.teamMember || ""}
        >
          {teamMembers.map((member, idx) => (
            <option key={idx} value={member}>{member}</option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          onChange={(e) => handleChange("month", e.target.value)}
          value={formData.month || ""}
        >
          {months.map((m, idx) => (
            <option key={idx} value={m.value}>{m.label}</option>
          ))}
        </select>

        <Button onClick={clearData}>Clear Data</Button>
      </div>

      <Card>
        <CardContent className="space-y-4 p-4">
          <h2 className="text-xl font-bold">Customer Complaint Division</h2>
          <Input
            placeholder="Start Date"
            value={formData.ccdStart || ""}
            onChange={(e) => handleChange("ccdStart", e.target.value)}
          />
          <Input
            placeholder="End Date"
            value={formData.ccdEnd || ""}
            onChange={(e) => handleChange("ccdEnd", e.target.value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 p-4">
          <h2 className="text-xl font-bold">Customer Success Division</h2>
          <Input
            placeholder="Customers Assigned"
            value={formData.customersAssigned || ""}
            onChange={(e) => handleChange("customersAssigned", e.target.value)}
          />
          <Input
            placeholder="Reviews Received/Removed"
            value={formData.reviews || ""}
            onChange={(e) => handleChange("reviews", e.target.value)}
          />
          <Input
            placeholder="Rate"
            value={formData.reviewRate || ""}
            onChange={(e) => handleChange("reviewRate", e.target.value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 p-4">
          <h2 className="text-xl font-bold">Positive Reviews</h2>
          <Input placeholder="Slacks" value={formData.slacks || ""} onChange={(e) => handleChange("slacks", e.target.value)} />
          <Input placeholder="Contacts Handled" value={formData.contacts || ""} onChange={(e) => handleChange("contacts", e.target.value)} />
          <Input placeholder="Handled Incoming" value={formData.incoming || ""} onChange={(e) => handleChange("incoming", e.target.value)} />
          <Input placeholder="Handled Outbound" value={formData.outbound || ""} onChange={(e) => handleChange("outbound", e.target.value)} />
          <Input placeholder="Avg. Hold Time" value={formData.holdTime || ""} onChange={(e) => handleChange("holdTime", e.target.value)} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 p-4">
          <h2 className="text-xl font-bold">Attendance</h2>
          <Input placeholder="Scheduled" value={formData.scheduled || ""} onChange={(e) => handleChange("scheduled", e.target.value)} />
          <Input placeholder="Worked" value={formData.worked || ""} onChange={(e) => handleChange("worked", e.target.value)} />
          <Input placeholder="Late" value={formData.late || ""} onChange={(e) => handleChange("late", e.target.value)} />
          <Input placeholder="Absent" value={formData.absent || ""} onChange={(e) => handleChange("absent", e.target.value)} />
          <Input placeholder="Score" value={formData.attendanceScore || ""} onChange={(e) => handleChange("attendanceScore", e.target.value)} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 p-4">
          <h2 className="text-xl font-bold">Manager Feedback</h2>
          <Textarea placeholder="Feedback for the month" value={formData.feedback || ""} onChange={(e) => handleChange("feedback", e.target.value)} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 p-4">
          <h2 className="text-xl font-bold">Errors</h2>
          <Textarea placeholder="Errors or issues" value={formData.errors || ""} onChange={(e) => handleChange("errors", e.target.value)} />
        </CardContent>
      </Card>
    </div>
  );
}
