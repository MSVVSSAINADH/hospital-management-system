import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DoctorCard } from "./DoctorCard";
import { BrowserRouter } from 'react-router-dom';

// Wrapper for components that use React Router's Link
const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(ui, { wrapper: BrowserRouter });
};

describe("DoctorCard", () => {
  const defaultProps = {
    image: "test-image.jpg",
    name: "Dr. Smith",
    specialty: "Cardiology",
  };

  it("renders doctor information correctly", () => {
    renderWithRouter(<DoctorCard {...defaultProps} />);

    expect(screen.getByText("Dr. Smith")).toBeInTheDocument();
    expect(screen.getByText("Cardiology")).toBeInTheDocument();
    expect(screen.getByText("View Profile")).toBeInTheDocument();

    const image = screen.getByRole("img", { name: /dr\. smith/i });
    expect(image).toHaveAttribute("src", "test-image.jpg");
  });

  it("renders social media icons correctly", () => {
    renderWithRouter(<DoctorCard {...defaultProps} />);
    
    // Check for social media icons by their accessible name (aria-label)
    expect(screen.getByLabelText("Facebook Profile")).toBeInTheDocument();
    expect(screen.getByLabelText("Twitter Profile")).toBeInTheDocument();
    expect(screen.getByLabelText("Instagram Profile")).toBeInTheDocument();
  });
});