import { expect } from 'chai'
import { Handler, Context, Callback } from 'aws-lambda'
import * as Joi from 'joi'
import { MainHandler } from '../src/handlers/MainHandler';
import {
  createMockCallback,
  createMockEvent,
  createMockContext
} from './helper';

describe('MainHandler', () => {
  const handler: Handler = (event: any, context: Context, callback: Callback): Promise<any> => {
    const body = JSON.parse(event.body)
    return Promise.resolve({
      statusCode: 200,
      body: JSON.stringify(body)
    })
  }


  describe('expect to throws an error when wrap the Handler function', () => {
    const JoiSchema: Joi.SchemaLike = {
      line: Joi.string()
        .required()
        .regex(/^\d{47,48}$/)
        .description('the line number of boleto or convenio')
    }

    it('when empty object fails with schema', async () => {
      const event: any = createMockEvent({})
      const context: Context = createMockContext()
      const callback: Callback = createMockCallback()
      const handlerWrapped = MainHandler(handler, JoiSchema)
      
      const { statusCode, body } = await handlerWrapped(event, context, callback)
      expect(statusCode).to.be.eq(400)
      expect(body).to.be.an('string')
      const bodyParsed = JSON.parse(body)
      expect(bodyParsed).to.be.an('object')
      expect(bodyParsed).to.have.keys([
        'status',
        'error'
      ])
      expect(bodyParsed.status).to.be.false
      expect(bodyParsed.error).to.be.an('object')
      expect(bodyParsed.error).to.have.keys([
        'isJoi',
        'name',
        'details',
        '_object'
      ])
      expect(bodyParsed.error.isJoi).to.be.true
      expect(bodyParsed.error.name).to.be.eq('ValidationError')
      expect(bodyParsed.error.details).to.be.an('array')
      expect(bodyParsed.error.details.length).to.be.greaterThan(0)
      expect(bodyParsed.error.details[0].message).to.be.an('string')
      expect(/"line" is required/.test(bodyParsed.error.details[0].message)).to.be.true
    })

    it('when invalid data type fails with schema', async () => {
      const event: any = createMockEvent({ line: 1 })
      const context: Context = createMockContext()
      const callback: Callback = createMockCallback()
      const handlerWrapped = MainHandler(handler, JoiSchema)
      
      const { statusCode, body } = await handlerWrapped(event, context, callback)
      expect(statusCode).to.be.eq(400)
      expect(body).to.be.an('string')
      const bodyParsed = JSON.parse(body)
      expect(bodyParsed).to.be.an('object')
      expect(bodyParsed).to.have.keys([
        'status',
        'error'
      ])
      expect(bodyParsed.status).to.be.false
      expect(bodyParsed.error).to.be.an('object')
      expect(bodyParsed.error).to.have.keys([
        'isJoi',
        'name',
        'details',
        '_object'
      ])
      expect(bodyParsed.error.isJoi).to.be.true
      expect(bodyParsed.error.name).to.be.eq('ValidationError')
      expect(bodyParsed.error.details).to.be.an('array')
      expect(bodyParsed.error.details.length).to.be.greaterThan(0)
      expect(bodyParsed.error.details[0].message).to.be.an('string')
      expect(/"line" must be a string/.test(bodyParsed.error.details[0].message)).to.be.true
    })

    it('when invalid length of data fails with schema', async () => {
      const event: any = createMockEvent({ line: '123456790' })
      const context: Context = createMockContext()
      const callback: Callback = createMockCallback()
      const handlerWrapped = MainHandler(handler, JoiSchema)
      
      const { statusCode, body } = await handlerWrapped(event, context, callback)
      expect(statusCode).to.be.eq(400)
      expect(body).to.be.an('string')
      const bodyParsed = JSON.parse(body)
      expect(bodyParsed).to.be.an('object')
      expect(bodyParsed).to.have.keys([
        'status',
        'error'
      ])
      expect(bodyParsed.status).to.be.false
      expect(bodyParsed.error).to.be.an('object')
      expect(bodyParsed.error).to.have.keys([
        'isJoi',
        'name',
        'details',
        '_object'
      ])
      expect(bodyParsed.error.isJoi).to.be.true
      expect(bodyParsed.error.name).to.be.eq('ValidationError')
      expect(bodyParsed.error.details).to.be.an('array')
      expect(bodyParsed.error.details.length).to.be.greaterThan(0)
      expect(bodyParsed.error.details[0].message).to.be.an('string')
      expect(
        /fails to match the required pattern/.test(bodyParsed.error.details[0].message)
      ).to.be.true
    })
  })

  describe('expect wrap successful the Handler function', () => {
    const JoiSchema: Joi.SchemaLike = {
      line: Joi.string()
        .required()
        .regex(/^\d{47,48}$/)
        .description('the line number of boleto or convenio')
    }

    const BODY_MOCK = { line: '07791000151100282017000071951503670630000005023' }

    it('when data type and length is correct', async () => {
      const event: any = createMockEvent(BODY_MOCK)
      const context: Context = createMockContext()
      const callback: Callback = createMockCallback()
      const handlerWrapped = MainHandler(handler, JoiSchema)
      const { statusCode, body } = await handlerWrapped(event, context, callback)

      expect(statusCode).to.be.an('number')
      expect(statusCode).to.be.eq(200)
      expect(body).to.be.an('string')
      const bodyParsed = JSON.parse(body)
      expect(bodyParsed).to.be.an('object')
      expect(bodyParsed).to.have.key('line')
      expect(bodyParsed.line).to.be.an('string')
      expect(bodyParsed.line).to.be.eq(BODY_MOCK.line)
    })
  })
})
