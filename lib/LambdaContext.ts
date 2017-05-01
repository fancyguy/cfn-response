export interface LambdaContext {
    logGroupName: string;
    logStreamName: string;
    succeed: (data: {}) => void;
    fail: (data: {}) => void;
}
