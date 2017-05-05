import * as _ from 'lodash';
import * as rp from 'request-promise';

import { CloudFormationEvent } from './CloudFormationEvent';
import { LambdaContext } from './LambdaContext';

const map = new WeakMap();

interface PrivateProps {
  responded: boolean;
  timeout?: NodeJS.Timer;
  resourceId?: string;
}

export class CloudFormationResponse {
  constructor(private event: CloudFormationEvent<any>, private context: LambdaContext) {
    map.set(this, {responded: false});
  }

  static get SUCCESS() {
    return 'SUCCESS';
  }

  static get FAILURE() {
    return 'FAILED';
  }

  get PhysicalResourceId() {
    const priv: PrivateProps = map.get(this);
    if (!priv.resourceId) {
      priv.resourceId = this.event.PhysicalResourceId ? this.event.PhysicalResourceId : this.context.logStreamName;
    }

    return priv.resourceId;
  }

  set PhysicalResourceId(id: string) {
    const priv: PrivateProps = map.get(this);
    priv.resourceId = id;
  }

  get responded() {
    const priv: PrivateProps = map.get(this);
    return priv.responded;
  }

  set timeout(milliseconds: number) {
    this.clearTimeout();

    const priv: PrivateProps = map.get(this);
    console.log('Custom timeout is ' + milliseconds + 'ms');
    priv.timeout = setTimeout(() => {
      this.failed(new Error(
        'The function took too long to execute, custom timeout triggered!'
      ));
    }, milliseconds);
  }

  success(data: {}) {
    console.error('Success:\n', JSON.stringify(data, null, 2));
    return this.send({
      Status: CloudFormationResponse.SUCCESS,
      Data: data,
    });
  }

  failed(err: Error) {
    console.error('Error: ' + err.message + '\n', err.stack);
    return this.send({
      Status: CloudFormationResponse.FAILURE,
      Reason: err.message + ' (See details in CloudWatch Log: ' + this.context.logGroupName + '/' + this.context.logStreamName + ')'
    });
  }

  private send(data: {}) {
    this.clearTimeout();
    if (this.responded) {
      console.log('CloudFormationResponse already sent, ignoring all subsequent sends.');
      return Promise.resolve();
    }

    const priv: PrivateProps = map.get(this);
    priv.responded = true;

    const responseBody = _.assign({
      StackId: this.event.StackId,
      RequestId: this.event.RequestId,
      LogicalResourceId: this.event.LogicalResourceId,
      PhysicalResourceId: this.PhysicalResourceId,
    }, data);

    console.log('CloudFormationResponse:\n', JSON.stringify(responseBody, null, 2));

    return rp.put({
      uri: this.event.ResponseURL,
      body: responseBody,
      json: true,
      headers: {
        'Content-Type': ''
      }
    }).then((res) => {
      this.context.succeed(res);
    }).catch((err) => {
      this.context.fail(err);
    });
  }

  private clearTimeout() {
    const priv: PrivateProps = map.get(this);
    if (priv.timeout) {
      clearTimeout(priv.timeout);
      delete priv.timeout;
    }
  }
}