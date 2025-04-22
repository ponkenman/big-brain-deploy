import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from "vitest";
import App from "../App";

describe("example test", () => {
  it("should pass", () => {
    expect(true).toBe(true);
  });
});

describe("app test", () => {
  it("captures the logos and renders them", () => {
    render(<App />);
    expect(screen.getByText('bigbrain')).toBeInTheDocument();
  });
});
