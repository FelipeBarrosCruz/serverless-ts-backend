# serverless-ts-backend
serverless-ts backend to parse digit line of boleto and convenios

# Install Serverless
```sh
yarn global add serverless
```

# Install Typescript
```sh
yarn global add typescript
```

# Test
```sh
yarn test
```

# Test with coverage
```sh
yarn test:coverage
```

# Test with docker
```sh
yarn test:docker
```

# Serverless offline start (watch)
```sh
yarn watch
```
# Serverless offline start with docker
```sh
yarn watch:docker
```

# Generate a package
npm run package

# Credentials configuration
https://serverless.com/framework/docs/providers/aws/guide/credentials/

## Create a AWS user with Access Keys and the following permissions:
- AWSLambdaFullAccess
- AdministratorAccess

## Using AWS Access Keys
```sh
export AWS_ACCESS_KEY_ID=\<your-key-here\>
export AWS_SECRET_ACCESS_KEY=\<your-secret-key-here\>
```

# Deploy
```sh
npm run deploy
```

# Usage

## Validate and Parse
`POST - /`

- Request: Body

  ```json
  {
    "line": "826500000003500101102019801111171212406651960584"
  }
  ```
- Response: Http-Code

  200
- Response: Body

  ```json
  {
      "barcode": "826500000003500101102019801111171212406651960584",
      "valid": true,
      "amount": 50.01,
      "dueDate": "2018-01-11T03:00:00.000Z"
  }
  ```
