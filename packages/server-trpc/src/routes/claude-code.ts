import { streamToEventIterator, EventPublisher } from '@orpc/server'
import { createUIMessageStream } from 'ai'
import { v7 as uuidv7 } from 'uuid'
import { z } from 'zod/v4'
import { orpc } from '../orpc'

const session = orpc.router({
  create: orpc
    .output(
      z.object({
        sessionId: z.string(),
      }),
    )
    .handler(async ({ context: { claudeCodeAgent } }) => {
      return claudeCodeAgent.session.create()
    }),
})

const prompt = orpc
  .input(
    z.object({
      sessionId: z.string(),
      prompt: z.string(),
    }),
  )
  .handler(async ({ input, context: { claudeCodeAgent } }) => {
    return claudeCodeAgent.prompt({
      sessionId: input.sessionId,
      prompt: input.prompt,
    })
  })

const subscribe = orpc
  .input(
    z.object({
      prompt: z.string(),
      sessionId: z.string(),
    }),
  )
  .handler(
    ({
      input: { prompt, sessionId },
      signal,
      context: { claudeCodeAgent },
    }) => {
      const session = claudeCodeAgent.session.get(sessionId)

      if (!session) {
        throw new Error('Session not found')
      }
      session.cancelled = false

      const { query, input } = session

      input.push({
        type: 'user',
        message: {
          role: 'user',
          content: prompt,
        },
        parent_tool_use_id: null,
        session_id: sessionId,
      })

      return streamToEventIterator(
        createUIMessageStream({
          async execute({ writer }) {
            while (true) {
              const { value: message, done } = await query.next()
              if (done || !message || session.cancelled) {
                return
              }
              console.log(JSON.stringify(message, null, 2))
              switch (message.type) {
                case 'system': {
                  break
                }
                case 'assistant': {
                  let hasTextPart = false
                  message.message.type
                  for (const part of message.message.content) {
                    switch (part.type) {
                      case 'text': {
                        hasTextPart = true
                        writer.write({
                          id: message.uuid,
                          type: 'text-start',
                        })
                        writer.write({
                          id: message.uuid,
                          type: 'text-delta',
                          delta: part.text,
                        })
                        break
                      }
                      case 'tool_use': {
                        writer.write({
                          type: 'tool-input-available',
                          toolCallId: part.id,
                          toolName: part.name,
                          input: part.input,
                          providerExecuted: true,
                        })
                        break
                      }
                      default: {
                        break
                      }
                    }
                  }
                  if (hasTextPart) {
                    writer.write({
                      id: message.uuid,
                      type: 'text-end',
                    })
                  }
                  break
                }
                case 'user': {
                  if (typeof message.message.content === 'string') {
                    const id = message.uuid || uuidv7()
                    writer.write({
                      id,
                      type: 'text-start',
                    })
                    writer.write({
                      id,
                      type: 'text-delta',
                      delta: message.message.content,
                    })
                    writer.write({
                      id,
                      type: 'text-end',
                    })
                  } else {
                    let hasTextPart = false
                    const id = message.uuid || uuidv7()
                    for (const part of message.message.content) {
                      switch (part.type) {
                        case 'text': {
                          hasTextPart = true
                          writer.write({
                            id,
                            type: 'text-start',
                          })
                          writer.write({
                            id,
                            type: 'text-delta',
                            delta: part.text,
                          })
                          break
                        }
                        case 'tool_result': {
                          writer.write({
                            type: 'tool-output-available',
                            toolCallId: part.tool_use_id,
                            output: part.content,
                            providerExecuted: true,
                          })
                          break
                        }
                      }
                    }
                    if (hasTextPart) {
                      writer.write({ id, type: 'text-end' })
                    }
                  }
                  break
                }
                case 'result': {
                  return
                }
              }
            }
          },
        }),
      )
    },
  )

export const claudeCode = {
  session,
  prompt,
  subscribe,
}

const anthropicMessagesResponseSchema = z.object({
  type: z.literal('message'),
  id: z.string().nullish(),
  model: z.string().nullish(),
  content: z.array(
    z.discriminatedUnion('type', [
      z.object({
        type: z.literal('text'),
        text: z.string(),
        // citations: z.array(citationSchema).optional(), // TODO
      }),
      z.object({
        type: z.literal('thinking'),
        thinking: z.string(),
        signature: z.string(),
      }),
      z.object({
        type: z.literal('redacted_thinking'),
        data: z.string(),
      }),
      z.object({
        type: z.literal('tool_use'),
        id: z.string(),
        name: z.string(),
        input: z.unknown(),
      }),
      z.object({
        type: z.literal('server_tool_use'),
        id: z.string(),
        name: z.string(),
        input: z.record(z.string(), z.unknown()).nullish(),
      }),
      z.object({
        type: z.literal('web_search_tool_result'),
        tool_use_id: z.string(),
        content: z.union([
          z.array(
            z.object({
              type: z.literal('web_search_result'),
              url: z.string(),
              title: z.string(),
              encrypted_content: z.string(),
              page_age: z.string().nullish(),
            }),
          ),
          z.object({
            type: z.literal('web_search_tool_result_error'),
            error_code: z.string(),
          }),
        ]),
      }),
      z.object({
        type: z.literal('code_execution_tool_result'),
        tool_use_id: z.string(),
        content: z.union([
          z.object({
            type: z.literal('code_execution_result'),
            stdout: z.string(),
            stderr: z.string(),
            return_code: z.number(),
          }),
          z.object({
            type: z.literal('code_execution_tool_result_error'),
            error_code: z.string(),
          }),
        ]),
      }),
    ]),
  ),
  stop_reason: z.string().nullish(),
  usage: z.looseObject({
    input_tokens: z.number(),
    output_tokens: z.number(),
    cache_creation_input_tokens: z.number().nullish(),
    cache_read_input_tokens: z.number().nullish(),
  }),
})
