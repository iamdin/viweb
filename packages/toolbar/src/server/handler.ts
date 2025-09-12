import { RPCHandler } from '@orpc/server/node'
import { routes } from '@viweb/server-trpc/routes'

export const handler = new RPCHandler(routes)
