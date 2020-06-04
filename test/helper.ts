import { Context, Callback } from 'aws-lambda';

export const createMockContext: any = () => {
  const ret: Context = {
    callbackWaitsForEmptyEventLoop: false,
    functionName: '',
    functionVersion: '',
    invokedFunctionArn: '',
    memoryLimitInMB: '0',
    awsRequestId: '',
    logGroupName: '',
    logStreamName: '',
    getRemainingTimeInMillis: () => 0,
    done: (error?: Error, result?: any) => { },
    fail: (error: Error | string) => { },
    succeed: (messageOrObject: any) => { },
  };
  return ret;
};

export const createMockCallback = (): Callback => {
  const callback: Callback<Response> =
    (error?: string | Error | null | undefined, result?: Response | undefined) => {
      return new Promise((resolve, reject) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      })
    };
    return callback
}

export const createMockEvent = (eventBody: any): any => {
  return { body: JSON.stringify(eventBody) };
}
