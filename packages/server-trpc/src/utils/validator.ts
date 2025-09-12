import { ZodSchema } from 'zod'

async function safeValidateTypes<OBJECT>({
  value,
  schema,
}: {
  value: unknown
  schema: ZodSchema<OBJECT>
}) {
  const validator2 = asValidator(schema)
  try {
    if (validator2.validate == null) {
      return { success: true, value, rawValue: value }
    }
    const result = await validator2.validate(value)
    if (result.success) {
      return { success: true, value: result.value, rawValue: value }
    }
    return {
      success: false,
      error: TypeValidationError2.wrap({ value, cause: result.error }),
      rawValue: value,
    }
  } catch (error) {
    return {
      success: false,
      error: TypeValidationError2.wrap({ value, cause: error }),
      rawValue: value,
    }
  }
}
