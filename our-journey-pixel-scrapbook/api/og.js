import { ImageResponse } from "@vercel/og";
import React from "react";

export const config = {
  runtime: "edge",
};

export default function handler(req) {
  const { searchParams } = new URL(req.url);
  const rawName = searchParams.get("name") || "Guest";
  const guestName = rawName.replace(/-/g, " ");

  const guestId =
    "#" +
    guestName
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  return new ImageResponse(
    React.createElement(
      "div",
      {
        style: {
          width: "1200px",
          height: "630px",
          background: "linear-gradient(#92d9ff 0 68%, #79c96b 68% 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "monospace",
        },
      },
      React.createElement(
        "div",
        {
          style: {
            width: "940px",
            height: "450px",
            background: "#fff8df",
            border: "14px solid #4b2f23",
            boxShadow: "18px 18px 0 #2a1d18",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          },
        },
        React.createElement(
          "div",
          {
            style: {
              fontSize: 46,
              color: "#a7345d",
              marginBottom: 28,
            },
          },
          "VISITOR PASS",
        ),
        React.createElement(
          "div",
          {
            style: {
              fontSize: 64,
              color: "#4b2f23",
              marginBottom: 18,
              textAlign: "center",
            },
          },
          guestName,
        ),
        React.createElement(
          "div",
          {
            style: {
              fontSize: 34,
              color: "#8d5a35",
              marginBottom: 34,
            },
          },
          guestId,
        ),
        React.createElement(
          "div",
          {
            style: {
              padding: "18px 42px",
              background: "#ffecb7",
              border: "7px solid #4b2f23",
              fontSize: 32,
              color: "#4b2f23",
            },
          },
          "Pipit ♥ Wulan Wedding Invitation",
        ),
      ),
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
