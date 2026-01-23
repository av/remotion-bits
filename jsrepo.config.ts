import { defineConfig } from "jsrepo";
import { repository } from "jsrepo/outputs";

export default defineConfig({
  registry: {
    name: "remotion-bits",
    outputs: [repository()],
    excludeDeps: ["react", "react-dom", "remotion"],
    defaultPaths: {
      component: "src/remotionbits",
    },
    items: [
      {
        name: "text-transition",
        title: "Text Transition",
        description: "Animated text transitions for Remotion compositions.",
        type: "component",
        files: [
          {
            path: "templates/components/TextTransition.tsx",
          },
        ],
      },
      {
        name: "backgrounds",
        title: "Backgrounds",
        description:
          "Gradient and solid background layers for Remotion scenes.",
        type: "component",
        files: [
          {
            path: "templates/components/Backgrounds.tsx",
          },
        ],
      },
      {
        name: "hero-title",
        title: "Hero Title",
        description:
          "Hero-style heading with animated entrance and accent line.",
        type: "component",
        files: [
          {
            path: "templates/components/HeroTitle.tsx",
          },
        ],
      },
    ],
  },
});
