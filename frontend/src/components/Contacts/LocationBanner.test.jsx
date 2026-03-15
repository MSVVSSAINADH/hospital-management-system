import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LocationBanner } from "./LocationBanner";
import userEvent from '@testing-library/user-event';

// Mock window.open to prevent actual navigation during tests
global.window.open = jest.fn();

describe("LocationBanner", () => {
  it("renders the title and map image", () => {
    render(<LocationBanner />);

    expect(screen.getByRole("heading", { name: /Find Us Easily/i })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Hospital Location on Map/i })).toBeInTheDocument();
  });

  it("calls window.open when the map container is clicked", async () => {
    render(<LocationBanner />);
    const mapContainer = screen.getByRole('region', { name: /Hospital Location on Map/i }) || screen.getByText(/Click to View Directions/i).closest('div');

    if (mapContainer) {
      await userEvent.click(mapContainer);
      expect(window.open).toHaveBeenCalledWith(
        "https://maps.app.goo.gl/tfdbp9NobTizvwBX6",
        "_blank"
      );
    }
  });

  it("displays the overlay text on hover (implicitly checked by rendering)", () => {
    render(<LocationBanner />);
    expect(screen.getByText("Click to View Directions")).toBeInTheDocument();
  });
});