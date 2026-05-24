export const colorTokens = [
  { name: "Background", bg: "bg-background", text: "text-foreground" },
  { name: "Foreground", bg: "bg-foreground", text: "text-background" },
  { name: "Card", bg: "bg-card", text: "text-foreground" },
  { name: "Primary", bg: "bg-primary", text: "text-white" },
  { name: "Secondary", bg: "bg-secondary", text: "text-secondary-foreground" },
  { name: "Accent", bg: "bg-accent", text: "text-accent-foreground" },
  { name: "Muted", bg: "bg-muted", text: "text-muted-foreground" },
  { name: "Destructive", bg: "bg-destructive", text: "text-white" },
];

export const spacingScale = [1, 2, 3, 4, 6, 8, 10, 12, 16].map((step) => ({
  value: step,
  label: `${step * 4}px`,
  size: step * 4,
}));
