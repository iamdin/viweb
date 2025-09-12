import {
  query,
  type Options,
  type Query,
  type SDKMessage,
  type SDKUserMessage,
} from '@anthropic-ai/claude-code'
import { EventPublisher } from '@orpc/server'
import { v7 as uuidv7 } from 'uuid'
import { Pushable } from '../utils/pushable'

interface Seesion {
  query: Query
  input: Pushable<SDKUserMessage>
  cancelled: false
  permissionMode: string
}

export class Session {
  private sessions: Record<string, Seesion> = {}

  get(id: string) {
    return this.sessions[id]
  }

  create() {
    const sessionId = uuidv7()
    const input = new Pushable<SDKUserMessage>()

    const options: Options = {
      mcpServers: {},
      // permissionPromptToolName: toolNames.permission,
      stderr: (err) => console.error(err),
      // note: although not documented by the types, passing an absolute path
      executable: process.execPath as 'node',
    }

    const q = query({
      prompt: input,
      options,
    })

    this.sessions[sessionId] = {
      query: q,
      input,
      cancelled: false,
      permissionMode: 'default',
    }

    return { sessionId }
  }
}

export class ClaudeCodeAgent {
  publisher = new EventPublisher<{
    message: {
      sessionId: string
      message: SDKMessage
    }
  }>()

  session = new Session()

  async prompt(params: { sessionId: string; prompt: string }) {
    const session = this.session.get(params.sessionId)
    if (!session) {
      throw new Error('Session not found')
    }
    session.cancelled = false

    const { query, input } = session

    input.push({
      type: 'user',
      message: {
        role: 'user',
        content: params.prompt,
      },
      parent_tool_use_id: null,
      session_id: params.sessionId,
    })
    while (true) {
      const { value: message, done } = await query.next()
      if (done || !message) {
        if (session.cancelled) {
          return { stopReason: 'cancelled' }
        }
        break
      }
      switch (message.type) {
        case 'system':
          break
        case 'result': {
          if (session.cancelled) {
            return { stopReason: 'cancelled' }
          }

          this.publisher.publish('message', {
            sessionId: params.sessionId,
            message,
          })

          // todo!() how is rate-limiting handled?
          switch (message.subtype) {
            case 'success': {
              // if (message.result.includes('Please run /login')) {
              //   throw RequestError.authRequired()
              // }
              return { stopReason: 'end_turn' }
            }
            case 'error_during_execution':
              return { stopReason: 'refusal' }
            case 'error_max_turns':
              return { stopReason: 'max_turn_requests' }
            default:
              return { stopReason: 'refusal' }
          }
        }
        case 'user':
        case 'assistant': {
          if (session.cancelled) {
            continue
          }

          break
        }
        default:
        // unreachable(message)
      }
    }
    throw new Error('Session did not end in result')
  }
}
