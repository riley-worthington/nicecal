import { ClerkApp } from "@clerk/remix";
import { rootAuthLoader } from "@clerk/remix/ssr.server";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import type { LinksFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { Provider } from "react-redux";
import { store } from "~/redux/store";
import { theme } from "~/theme";
import CommandCenter from "./components/CommandCenter";
import { InitialSyncPrompt } from "./sync/InitialSyncPrompt";
import { SyncProvider } from "./sync/SyncProvider";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./global.css";

export const meta: MetaFunction = () => {
  return [
    { title: "nicecal" },
    { name: "description", content: "a very nice calendar." },
    {
      property: "og:title",
      content: "nicecal",
    },
    {
      property: "og:description",
      content: "a very nice calendar.",
    },
  ];
};

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
];

export const loader: LoaderFunction = (args) => rootAuthLoader(args);

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body>
        <Provider store={store}>
          <MantineProvider theme={theme} defaultColorScheme="light">
            <Notifications position="bottom-center" />
            {children}
          </MantineProvider>
        </Provider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// SyncProvider, CommandCenter, and InitialSyncPrompt must live here — inside
// ClerkApp — because they use useUser(), which requires the Clerk context.
// Layout is rendered outside ClerkApp and cannot use Clerk hooks.
function App() {
  return (
    <SyncProvider>
      <CommandCenter />
      <InitialSyncPrompt />
      <Outlet />
    </SyncProvider>
  );
}

export default ClerkApp(App);
