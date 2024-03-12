import React from "react";
import { render, screen } from "@testing-library/react";
import FriendPage from "../app/profile/[slug]/page";
import { useSession } from "next-auth/react";
import fetchMock from "jest-fetch-mock";
import { act } from "react-dom/test-utils";
import nextJest from "next/jest.js";

jest.mock("next-auth/react");

beforeEach(() => {
  fetchMock.resetMocks();
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
  expect(screen.getByText("Total time: 200 min")).toBeTruthy();
});
