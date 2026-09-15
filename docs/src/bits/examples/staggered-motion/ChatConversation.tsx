import React from "react";
import { StaggeredMotion, useViewportRect } from "remotion-bits";

export const metadata = {
  name: "Chat Conversation",
  description: "Messaging-app style conversation with bubbles arriving one after another.",
  tags: ["chat", "messages", "ui", "staggered-motion", "product-demo"],
  duration: 150,
  width: 1080,
  height: 1920,
  registry: {
    name: "bit-chat-conversation",
    title: "Chat Conversation",
    description: "Messaging-app style conversation with bubbles arriving one after another.",
    type: "bit" as const,
    add: "when-needed" as const,
    registryDependencies: ["staggered-motion", "use-viewport-rect"],
    dependencies: [],
    files: [
      {
        path: "docs/src/bits/examples/staggered-motion/ChatConversation.tsx",
      },
    ],
  },
};

export const props = {
  variant: "pop",
  showAvatars: true,
  stagger: 20,
};

export const controls = [
  {
    key: "variant",
    type: "select" as const,
    label: "Entrance",
    options: [
      { label: "Pop", value: "pop" },
      { label: "Slide from side", value: "slide" },
      { label: "Rise and unblur", value: "rise" },
    ],
  },
  { key: "showAvatars", type: "boolean" as const, label: "Show avatars" },
  { key: "stagger", type: "number" as const, label: "Frames between messages", min: 6, max: 40, step: 2 },
];

export const Component: React.FC = () => {
  const rect = useViewportRect();
  const vmin = rect.vmin;

  const messages = [
    { from: "them", text: "Hey, did the render finish?" },
    { from: "me", text: "Yep, 4K in under two minutes." },
    { from: "them", text: "No way. What did you change?" },
    { from: "me", text: "Switched the intro to remotion-bits." },
    { from: "me", text: "Staggered motion, zero manual keyframes." },
    { from: "them", text: "Okay, sending you the next brief now." },
  ];

  const bubbleFont = vmin * 4;
  const maxBubbleWidth = rect.vw * 66;
  const avatarSize = vmin * 6;
  const startDelay = 10;

  const transitionFor = (isMe: boolean) => {
    if (props.variant === "slide") {
      return {
        x: [isMe ? vmin * 14 : -vmin * 14, 0],
        opacity: [0, 1],
        duration: 20,
        easing: "easeOutCubic" as const,
      };
    }
    if (props.variant === "rise") {
      return {
        y: [vmin * 7, 0],
        opacity: [0, 1],
        blur: [8, 0],
        duration: 24,
        easing: "easeOutCubic" as const,
      };
    }
    return {
      scale: [0.4, 1],
      y: [vmin * 4, 0],
      opacity: [0, 1],
      duration: 22,
      easing: "spring" as const,
    };
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: vmin * 2.2,
        padding: `0 ${rect.vw * 6}px`,
        backgroundColor: "var(--color-background-dark)",
        fontFamily: "sans-serif",
      }}
    >
      {messages.map((message, index) => {
        const isMe = message.from === "me";
        return (
          <StaggeredMotion
            key={index}
            transition={{
              ...transitionFor(isMe),
              delay: startDelay + index * props.stagger,
            }}
            style={{
              display: "flex",
              flexDirection: isMe ? "row-reverse" : "row",
              alignItems: "flex-end",
              gap: vmin * 1.5,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: isMe ? "row-reverse" : "row",
                alignItems: "flex-end",
                gap: vmin * 1.5,
                transformOrigin: isMe ? "bottom right" : "bottom left",
              }}
            >
              {props.showAvatars && (
                <div
                  style={{
                    width: avatarSize,
                    height: avatarSize,
                    borderRadius: "50%",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: avatarSize * 0.42,
                    fontWeight: 700,
                    color: isMe ? "var(--color-background-dark)" : "white",
                    backgroundColor: isMe ? "var(--color-primary-hover)" : "var(--color-surface-light)",
                  }}
                >
                  {isMe ? "ME" : "AL"}
                </div>
              )}
              <div
                style={{
                  maxWidth: maxBubbleWidth,
                  padding: `${vmin * 2.2}px ${vmin * 3.2}px`,
                  borderRadius: vmin * 4,
                  borderBottomRightRadius: isMe ? vmin * 1 : vmin * 4,
                  borderBottomLeftRadius: isMe ? vmin * 4 : vmin * 1,
                  backgroundColor: isMe ? "var(--color-primary)" : "var(--color-surface-light)",
                  color: "white",
                  fontSize: bubbleFont,
                  lineHeight: 1.3,
                  boxShadow: `0 ${vmin * 0.6}px ${vmin * 2}px rgba(0, 0, 0, 0.35)`,
                }}
              >
                {message.text}
              </div>
            </div>
          </StaggeredMotion>
        );
      })}
    </div>
  );
};
