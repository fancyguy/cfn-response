export interface CloudFormationEvent<T> {
  StackId: string;
  RequestId: string;
  LogicalResourceId: string;
  PhysicalResourceId: string;
  ResponseURL: string;
  ResourceProperties: T;
}
