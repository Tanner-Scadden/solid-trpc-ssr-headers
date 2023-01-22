import { QueryClient } from "@adeora/solid-query";
import { httpBatchLink } from "@trpc/client";
import { isServer } from "solid-js/web";
import { useRequest } from "solid-start/server";
import { createTRPCSolid } from "solid-trpc";
import type { IAppRouter } from "~/server/trpc/router/_app";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return "";
  return `http://localhost:${process.env.PORT ?? 5173}`;
};

// Option 1:
export const trpc = createTRPCSolid<IAppRouter>();
export const client = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
      // Maybe we can pass ctx into the headers object? Not sure
      async headers() {
        if (isServer) {
          const context = useRequest();
          // Context should have a value here to grab the cookies off of the request, but it is empty.
          return {};
        } else {
          return {};
        }
      },
    }),
  ],
});

export const queryClient = new QueryClient();

// Option 2 (nextjs way):
// export const trpc = createTRPCSolid<IAppRouter>({
//   config({ ctx }) {
//     if (typeof window !== "undefined") {
//       // during client requests
//     }
//     return {
//       // transformer: superjson, // optional - adds superjson serialization
//       links: [
//         httpBatchLink({
//           // The server needs to know your app's full url
//           url: `${getBaseUrl()}/api/trpc`,
//           /**
//            * Set custom request headers on every request from tRPC
//            * @link https://trpc.io/docs/v10/header
//            * @link https://trpc.io/docs/ssr
//            */
//           headers() {
//             if (ctx?.req) {
//               // Access cookies from the req and add to authorization header
//               // ...
//               return {};
//             }
//             return {};
//           },
//         }),
//       ],
//     };
//   },
// });
