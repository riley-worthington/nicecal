import { createTheme } from "@mantine/core";

export const theme = createTheme({
  /** Put your mantine theme override here */
  primaryColor: "yellow",
  primaryShade: 4,
  colors: {
    yellow: [
      "#fffae2",
      "#fdf3ce",
      "#f9e6a0",
      "#f6d86e",
      "#f3cc44",
      "#f1c529",
      "#f0c118",
      "#d6aa08",
      "#be9700",
      "#a48200",
    ],
    dark: [
      "#d5d7e0",
      "#acaebf",
      "#8c8fa3",
      "#666980",
      "#4d4f66",
      "#34354a",
      "#2b2c3d",
      "#1d1e30",
      "#0c0d21",
      "#01010a",
    ],
  },
});
