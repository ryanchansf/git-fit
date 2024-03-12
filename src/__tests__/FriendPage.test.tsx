import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import FriendPage from "../app/profile/[slug]/page";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import fetchMock from "jest-fetch-mock";
import { act } from "react-dom/test-utils";

jest.mock("next-auth/react");
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

beforeEach(() => {
  fetchMock.resetMocks();
});

test("clicking following navigates to /friends when the link is clicked", async () => {
  (useSession as jest.Mock).mockReturnValue({
    data: {
      user: {
        name: "test",
        email: "test@example.com",
      },
    },
  });
  const push = jest.fn();
  (useRouter as jest.Mock).mockReturnValue({
    push,
  });

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
  fetchMock.mockResponseOnce(
    JSON.stringify({
      message: "Workouts retrieved",
      status: 200,
      data: [
        {
          w_id: 47,
          username: "aaa1",
          duration: 200,
          difficulty: "easy",
          tags: ["biceps"],
          w_name: "test",
        },
        {
          w_id: 48,
          username: "aaa1",
          duration: 200,
          difficulty: "easy",
          tags: ["biceps"],
          w_name: "test2",
        },
      ],
    }),
  );

  await act(async () => {
    render(<FriendPage params={{ slug: "test" }} />);
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
  const push = jest.fn();
  (useRouter as jest.Mock).mockReturnValue({
    push,
  });

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
  fetchMock.mockResponseOnce(
    JSON.stringify({
      message: "Workouts retrieved",
      status: 200,
      data: [
        {
          w_id: 47,
          username: "aaa1",
          duration: 200,
          difficulty: "easy",
          tags: ["biceps"],
          w_name: "test",
        },
        {
          w_id: 48,
          username: "aaa1",
          duration: 200,
          difficulty: "easy",
          tags: ["biceps"],
          w_name: "test2",
        },
      ],
    }),
  );

  await act(async () => {
    render(<FriendPage params={{ slug: "test" }} />);
  });
  const linkElement = screen.getByText("Followers").closest("a");
  expect(linkElement!.getAttribute("href")).toBe("/friends");
});

test("fetches profile data successfully", async () => {
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
  fetchMock.mockResponseOnce(
    JSON.stringify({
      message: "Workouts retrieved",
      status: 200,
      data: [
        {
          w_id: 47,
          username: "aaa1",
          duration: 200,
          difficulty: "easy",
          tags: ["biceps"],
          w_name: "test",
        },
        {
          w_id: 48,
          username: "aaa1",
          duration: 200,
          difficulty: "easy",
          tags: ["biceps"],
          w_name: "test2",
        },
      ],
    }),
  );

  await act(async () => {
    render(<FriendPage params={{ slug: "test" }} />);
  });

  expect(fetch).toHaveBeenCalledTimes(2);
});

test("state is successfully updated after fetch", async () => {
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
  fetchMock.mockResponseOnce(
    JSON.stringify({
      message: "Workouts retrieved",
      status: 200,
      data: [
        {
          w_id: 47,
          username: "aaa1",
          duration: 200,
          difficulty: "easy",
          tags: ["biceps"],
          w_name: "test",
        },
        {
          w_id: 48,
          username: "aaa1",
          duration: 200,
          difficulty: "easy",
          tags: ["biceps"],
          w_name: "test2",
        },
      ],
    }),
  );

  await act(async () => {
    render(<FriendPage params={{ slug: "test" }} />);
  });

  expect(screen.getByText("test")).toBeTruthy();
  expect(screen.getByText("11")).toBeTruthy();
  expect(screen.getByText("12")).toBeTruthy();
  expect(screen.getByText("13")).toBeTruthy();
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
  fetchMock.mockRejectOnce(new Error("Failed to fetch"));

  console.error = jest.fn(); // Mock console.error

  render(<FriendPage params={{ slug: "test" }} />);

  // Wait for the error to be logged
  await waitFor(() => {
    expect(console.error).toHaveBeenCalledWith(
      "Error fetching profile data:",
      expect.any(Error),
    );
  });
});
