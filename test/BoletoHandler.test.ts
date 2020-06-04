import { expect } from 'chai'
import { Context, Callback } from 'aws-lambda'
import { handler } from '../src/handlers/boleto';
import {
  createMockCallback,
  createMockEvent,
  createMockContext
} from './helper';

describe('BoletoHandler', () => {
  describe('expect validate', () => {

    it('when empty object fails with schema', async () => {
      const event: any = createMockEvent({})
      const context: Context = createMockContext()
      const callback: Callback = createMockCallback()
      
      const { statusCode, body } = await handler(event, context, callback)
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
      
      const { statusCode, body } = await handler(event, context, callback)
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

    it('when invalid data type fails with schema', async () => {
      const event: any = createMockEvent({ line: '1234567890' })
      const context: Context = createMockContext()
      const callback: Callback = createMockCallback()
      
      const { statusCode, body } = await handler(event, context, callback)
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

  describe('expect parse boleto', () => {
    it('when boleto line is invalid', async () => {
      const line = '07791000151100282017000071951503670630000005020'
      const event: any = createMockEvent({ line })
      const context: Context = createMockContext()
      const callback: Callback = createMockCallback()
      
      const { statusCode, body } = await handler(event, context, callback)
      expect(statusCode).to.be.an('number')
      expect(statusCode).to.be.eq(200)
      expect(body).to.be.an('string')
      const bodyParsed = JSON.parse(body)
      expect(bodyParsed).to.have.key('valid')
      expect(bodyParsed.valid).to.be.an('boolean')
      expect(bodyParsed.valid).to.be.false
    })

    it('when boleto line is valid', async () => {
      const line = '07791000151100282017000071951503670630000005023'
      const event: any = createMockEvent({ line })
      const context: Context = createMockContext()
      const callback: Callback = createMockCallback()
      
      const { statusCode, body } = await handler(event, context, callback)
      expect(statusCode).to.be.an('number')
      expect(statusCode).to.be.eq(200)
      expect(body).to.be.an('string')
      const bodyParsed = JSON.parse(body)
      expect(bodyParsed).to.have.keys([
        'valid',
        'amount',
        'barcode',
        'dueDate'
      ])
      expect(bodyParsed.valid).to.be.an('boolean')
      expect(bodyParsed.valid).to.be.true
      expect(bodyParsed.amount).to.be.eq(50.23)
      expect(bodyParsed.dueDate).to.be.eq('2017-02-07T03:00:00.000Z')
      expect(bodyParsed.barcode).to.be.eq('07791000151100282017000071951503670630000005023')
    })
  })

  describe('expect parse convenio', () => {
    it('when line is invalid', async () => {
      const line = '826500000003500101102019801111171212406651960580'
      const event: any = createMockEvent({ line })
      const context: Context = createMockContext()
      const callback: Callback = createMockCallback()
      
      const { statusCode, body } = await handler(event, context, callback)
      expect(statusCode).to.be.an('number')
      expect(statusCode).to.be.eq(200)
      expect(body).to.be.an('string')
      const bodyParsed = JSON.parse(body)
      expect(bodyParsed).to.have.key('valid')
      expect(bodyParsed.valid).to.be.an('boolean')
      expect(bodyParsed.valid).to.be.false
    })

    it('when line is valid', async () => {
      const line = '826500000003500101102019801111171212406651960584'
      const event: any = createMockEvent({ line })
      const context: Context = createMockContext()
      const callback: Callback = createMockCallback()
      
      const { statusCode, body } = await handler(event, context, callback)
      expect(statusCode).to.be.an('number')
      expect(statusCode).to.be.eq(200)
      expect(body).to.be.an('string')
      const bodyParsed = JSON.parse(body)
      expect(bodyParsed).to.have.keys([
        'valid',
        'amount',
        'barcode',
        'dueDate'
      ])
      expect(bodyParsed.valid).to.be.an('boolean')
      expect(bodyParsed.valid).to.be.true
      expect(bodyParsed.amount).to.be.eq(50.01)
      expect(bodyParsed.dueDate).to.be.eq('2018-01-11T03:00:00.000Z')
      expect(bodyParsed.barcode).to.be.eq('826500000003500101102019801111171212406651960584')
    })
  })

})
