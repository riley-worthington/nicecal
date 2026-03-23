import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import { Switch, useMantineColorScheme } from "@mantine/core";

export default function DarkModeToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme({
    keepTransitions: true,
  });
  const dark = colorScheme === "dark";

  return (
    <Switch
      checked={dark}
      onChange={toggleColorScheme}
      size="md"
      color={dark ? "dark.4" : "yellow.4"}
      aria-label="Toggle dark mode"
      onLabel={
        <SunIcon width={14} height={14} color="var(--mantine-color-yellow-4)" />
      }
      offLabel={
        <MoonIcon width={14} height={14} color="var(--mantine-color-blue-6)" />
      }
      thumbIcon={
        dark ? (
          <MoonIcon
            width={12}
            height={12}
            style={{ color: "var(--mantine-color-blue-6)" }}
          />
        ) : (
          <SunIcon
            width={12}
            height={12}
            style={{ color: "var(--mantine-color-yellow-6)" }}
          />
        )
      }
      styles={{
        root: {
          cursor: "pointer",
        },
        track: {
          cursor: "pointer",
        },
      }}
    />
  );
}
