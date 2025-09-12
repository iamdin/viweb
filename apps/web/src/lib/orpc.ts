import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import type { RouterClient } from '@orpc/server'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'
import { QueryCache, QueryClient } from '@tanstack/react-query'
import type { Routes } from '@viweb/server-trpc/routes'
import { toast } from 'sonner'

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      toast.error(`Error: ${error.message}`, {
        action: {
          label: 'retry',
          onClick: () => {
            queryClient.invalidateQueries()
          },
        },
      })
    },
  }),
})

export const link = new RPCLink({
  url: `${import.meta.env.VITE_SERVER_URL}/api/rpc`,
})

export const client: RouterClient<Routes> = createORPCClient(link)

export const orpc = createTanstackQueryUtils(client)
