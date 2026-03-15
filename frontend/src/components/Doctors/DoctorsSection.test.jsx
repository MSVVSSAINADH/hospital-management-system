import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DoctorsSection from "./DoctorsSection";

describe("DoctorsSection", () => {
  it("renders the doctors section with all components", () => {
    render(<DoctorsSection />);

    // Check if main sections are rendered
    expect(screen.getByRole("img", { name: /hero/i })).toBeInTheDocument();
    expect(screen.getAllByText("Doctor's Name")).toHaveLength(6);
    expect(screen.getAllByText("Neurology")).toHaveLength(6);
    expect(screen.getAllByText("View Profile")).toHaveLength(6);

    // Check if testimonial section is rendered
    expect(screen.getByText("John Doe")).toBeInTheDocument();

    // Check if contact section is rendered
    expect(screen.getByText("Get in touch")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();

    // Check if footer is rendered
    expect(screen.getByText(/Leading the Way in Medical/i)).toBeInTheDocument();
  });
});
