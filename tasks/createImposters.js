import fetch from 'node-fetch';
import debug from 'debug';
import config from '../config';

const log = debug('proxy:createImposters');
const error = debug('proxy:createImposters:error');

const oldApi = {
  port: 4000,
  protocol: 'http',
  stubs: [
    {
      predicates: [
        {
          equals: {
            method: 'GET',
            path: '/customers/123',
          },
        },
      ],
      responses: [
        {
          is: {
            statusCode: 200,
            headers: {
              'Access-Control-Allow-Origin': 'www.test-url.com',
            },
            body: JSON.stringify({
              id: 123,
              firstname: 'John',
              surname: 'Doe',
            }),
          },
          _behaviors: {
            wait: 500,
          },
        },
      ],
    },
  ],
};

const newApi = {
  port: 4001,
  protocol: 'http',
  stubs: [
    {
      predicates: [
        {
          equals: {
            method: 'GET',
            path: '/customers/123',
          },
        },
      ],
      responses: [
        {
          is: {
            statusCode: 200,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: 123,
              firstName: 'John',
              lastName: 'Doe',
            }),
          },
          _behaviors: {
            wait: 100,
          },
        },
      ],
    },
  ],
};

const imposters = {
  imposters: [
    oldApi,
    newApi,
  ],
};

// create old API
fetch(`${config.mbEndpoint}/imposters`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  body: JSON.stringify(imposters),
})
.then(res => {
  log(res);
})
.catch(err => {
  error(err);
});
