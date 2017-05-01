export interface CloudFormationEvent {
    StackId: string;
    RequestId: string;
    LogicalResourceId: string;
    PhysicalResourceId: string;
    ResponseURL: string;
}
