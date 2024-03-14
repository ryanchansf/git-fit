import React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  getByRole,
} from "@testing-library/react";
import ProfilePage from "../app/profile/page";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import fetchMock from "jest-fetch-mock";
import { act } from "react-dom/test-utils";
import { signOut } from "next-auth/react";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
}));

test("clicking following navigates to /friends when the link is clicked", async () => {
  (useSession as jest.Mock).mockReturnValue({
    data: {
      user: {
        name: "test",
        email: "test@example.com",
      },
    },
  });
  // Mock the fetch call
  fetchMock.mockResponseOnce(
    JSON.stringify({
      data: {
        workouts: 12,
        followers: 11,
        following: 13,
      },
      status: 200,
    }),
  );
  const push = jest.fn();
  (useRouter as jest.Mock).mockReturnValue({
    push,
  });

  await act(async () => {
    render(<ProfilePage />);
  });
  const linkElement = screen.getByText("Following").closest("a");
  expect(linkElement!.getAttribute("href")).toBe("/friends");
});

test("clicking followers navigates to /friends when the link is clicked", async () => {
  (useSession as jest.Mock).mockReturnValue({
    data: {
      user: {
        name: "test",
        email: "test@example.com",
      },
    },
  });
  // Mock the fetch call
  fetchMock.mockResponseOnce(
    JSON.stringify({
      data: {
        workouts: 12,
        followers: 11,
        following: 13,
      },
      status: 200,
    }),
  );
  const push = jest.fn();
  (useRouter as jest.Mock).mockReturnValue({
    push,
  });

  await act(async () => {
    render(<ProfilePage />);
  });
  const linkElement = screen.getByText("Followers").closest("a");
  expect(linkElement!.getAttribute("href")).toBe("/friends");
});

test("clicking followers navigates to /friends when the link is clicked", async () => {
  (useSession as jest.Mock).mockReturnValue({
    data: {
      user: {
        name: "test",
        email: "test@example.com",
      },
    },
  });
  // Mock the fetch call
  fetchMock.mockResponseOnce(
    JSON.stringify({
      data: {
        workouts: 12,
        followers: 11,
        following: 13,
      },
      status: 200,
    }),
  );
  const push = jest.fn();
  (useRouter as jest.Mock).mockReturnValue({
    push,
  });

  await act(async () => {
    render(<ProfilePage />);
  });

  fireEvent.click(screen.getByTestId("logout-button"));

  expect(signOut).toHaveBeenCalled();
});

test("handles fetch error", async () => {
  // Mock the session
  (useSession as jest.Mock).mockReturnValue({
    data: {
      user: {
        name: "test",
        email: "test@example.com",
      },
    },
  });

  // Mock the fetch call to reject with an error
  fetchMock.mockRejectOnce(new Error("Failed to fetch"));

  console.error = jest.fn(); // Mock console.error

  render(<ProfilePage />);

  // Wait for the error to be logged
  await waitFor(() => {
    expect(console.error).toHaveBeenCalledWith(
      "Error fetching profile data:",
      expect.any(Error),
    );
  });
});

test("state is updated after fetch", async () => {
  (useSession as jest.Mock).mockReturnValue({
    data: {
      user: {
        name: "test",
        email: "test@example.com",
      },
    },
  });
  // Mock the fetch call
  fetchMock.mockResponseOnce(
    JSON.stringify({
      data: {
        workouts: 12,
        followers: 11,
        following: 13,
      },
      status: 200,
    }),
  );
  const push = jest.fn();
  (useRouter as jest.Mock).mockReturnValue({
    push,
  });

  await act(async () => {
    render(<ProfilePage />);
  });

  expect(screen.getByText("12")).toBeTruthy();
  expect(screen.getByText("11")).toBeTruthy();
  expect(screen.getByText("13")).toBeTruthy();
});
