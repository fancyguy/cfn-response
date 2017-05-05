declare type CloudFormationRequestType = "Create" | "Update" | "Delete";

interface CloudFormationEvent<T> {
  StackId: string;
  RequestId: string;
  LogicalResourceId: string;
  PhysicalResourceId: string;
  ResponseURL: string;
  ResourceProperties: T;
  RequestType: CloudFormationRequestType;
}

interface LambdaContext<T> {
  callbackWaitsForEmptyEventLoop: boolean;
  functionName: string;
  functionVersion: string;
  invokedFunctionArn: string;
  memoryLimitInMB: number;
  awsRequestId: string;
  logGroupName: string;
  logStreamName: string;
  identity: CognitoIdentityContext | null;
  clientContext: ClientContext<T> | null;

  getRemainingTimeInMillis(): number;
  succeed(result: {}): void;
  fail(error: Error | null): void;
  done(error: Error | null, result: {}): void;
}

interface CognitoIdentityContext {
  cognitoIdentityId: string;
  cognitoIdentityPoolId: string;
}

interface ClientContext<T> {
  client: ClientContextClient;
  Custom?: T;
  env: ClientContextEnv;
}

interface ClientContextClient {
  installation_id: string;
  app_title: string;
  app_version_name: string;
  app_version_code: string;
  app_package_name: string;
}

interface ClientContextEnv {
  platform_version: string;
  platform: string;
  make: string;
  model: string;
  locale: string;
}
