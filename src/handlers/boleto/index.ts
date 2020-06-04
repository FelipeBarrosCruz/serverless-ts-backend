import { Handler, Context, Callback } from 'aws-lambda'
import { MainHandler } from '../MainHandler'
import * as Joi from 'joi'
// @ts-ignore
import * as zboletos from 'zboletos'

const BoletoValidateSchema: Joi.SchemaLike = {
  line: Joi.string()
    .required()
    .regex(/^\d{47,48}$/)
    .description('the digit line of boleto or convenio')
}

const BoletoHandler: Handler = async (event: any, context: Context, callback: Callback) => {
  const bodyParsed = JSON.parse(event.body)
  const result = zboletos(bodyParsed.line)

  if (!result || result && !result.valid) {
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({ valid: false }),
    })
  }

  return callback(null, {
    statusCode: 200,
    body: JSON.stringify(result),
  })
}

export const handler = MainHandler(BoletoHandler, BoletoValidateSchema)
