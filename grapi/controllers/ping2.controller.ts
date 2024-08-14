import {inject} from '@loopback/core';
import {
  Request,
  RestBindings,
  get,
  response,
  ResponseObject,
} from '@loopback/rest';

/**
 * OpenAPI response for ping2()
 */
const PING2_RESPONSE: ResponseObject = {
  description: 'Ping2 Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'Ping2Response',
        properties: {
          greeting: {type: 'string'},
          date: {type: 'string'},
          url: {type: 'string'},
          headers: {
            type: 'object',
            properties: {
              'Content-Type': {type: 'string'},
            },
            additionalProperties: true,
          },
        },
      },
    },
  },
};

/**
 * A simple controller to bounce back http requests
 */
export class Ping2Controller {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) {}

  // Map to `GET /ping2`
  @get('/ping2')
  @response(200, PING2_RESPONSE)
  ping2(): object {
    // Reply with a greeting, the current time, the url, and request headers
    return {
      greeting: 'Hello from grapple',
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
    };
  }
}
