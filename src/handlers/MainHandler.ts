import { Handler, Context, Callback } from 'aws-lambda';
import { validate, ValidationResult, SchemaLike, ValidationOptions } from 'joi'

const JoiOptions: ValidationOptions = { abortEarly: true }

export const MainHandler = (handler: Handler, validateSchema: SchemaLike): Handler => {
  return async (event: any, context: Context, callback: Callback): Promise<any> => {
    const { body } = event
    const isValid: ValidationResult<any> = validate(body, validateSchema, JoiOptions)
    
    if (isValid.error) {
      return callback(null, {
        statusCode: 400,
        body: JSON.stringify({
          status: false,
          error: isValid.error
        })
      })
    }

    return await handler(event, context, callback)
  }
}

