import fsp from "node:fs/promises";

const markdownMatch = /\.md$/;
const rawMarkdown = {
  name: "markdown-loader",
  async load(id: string) {
    if (markdownMatch.test(id)) {
      // raw query, read file and return as string
      return `export default ${JSON.stringify(
        await fsp.readFile(id, "utf-8"),
      )}`;
    }
  },
};

export default {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  framework: "@storybook/marko-vite",
  addons: ["@storybook/addon-a11y"],
  parameters: {
    docs: {
      description: {
        component: "Another description, overriding the comments",
      },
    },
  },
  staticDirs: ["./static"],
  docs: {
    autodocs: true,
    defaultName: "Documentation",
  },
  core: {
    disableTelemetry: true,
    disableWhatsNewNotifications: true,
  },
  async viteFinal(config: any) {
    const { mergeConfig } = await import("vite");
    return mergeConfig(config, {
      plugins: [rawMarkdown],
      optimizeDeps: {
        // Pre-bundle @storybook/addon-docs/blocks to avoid runtime errors
        // This is needed because MDX documentation requires these blocks to be available
        // during dynamic imports
        include: ["@storybook/addon-docs/blocks"],
      },
    });
  },
};
