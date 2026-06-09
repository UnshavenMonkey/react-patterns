import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CroppedText, type CroppedTextProps } from "./CroppedText";

const sampleText =
  "ResizeObserver lets this component react to the real width of its own container. The text is shortened with binary search, so only the longest fitting fragment stays visible.";

const meta = {
  title: "Components/CroppedText",
  component: CroppedText,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A responsive cropped text component based on useLayoutEffect, ResizeObserver and binary search.",
      },
    },
  },
  argTypes: {
    children: { control: "text" },
    opened: { control: "boolean" },
    rows: { control: { type: "number", min: 1, max: 8 } },
    ellipsis: { control: "text" },
    onCropChange: { action: "crop changed" },
  },
  args: {
    children: sampleText,
    opened: false,
    rows: 2,
    ellipsis: "...",
  },
} satisfies Meta<typeof CroppedText>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: 420 }}>
      <CroppedText {...args} />
    </div>
  ),
};

export const Opened: Story = {
  args: {
    opened: true,
  },
  render: (args) => (
    <div style={{ width: 420 }}>
      <CroppedText {...args} />
    </div>
  ),
};

export const NarrowContainer: Story = {
  args: {
    rows: 3,
  },
  render: (args) => (
    <div style={{ width: 260 }}>
      <CroppedText {...args} />
    </div>
  ),
};

const ResizableExample = (args: CroppedTextProps) => {
  const [opened, setOpened] = useState(Boolean(args.opened));

  return (
    <div className="cropped-text-demo">
      <div className="cropped-text-story-controls">
        <button type="button" onClick={() => setOpened((current) => !current)}>
          {opened ? "Collapse" : "Expand"}
        </button>
      </div>
      <div className="cropped-text-resizable">
        <CroppedText {...args} opened={opened} />
      </div>
    </div>
  );
};

export const Resizable: Story = {
  args: {
    rows: 2,
  },
  render: (args) => <ResizableExample {...args} />,
};
