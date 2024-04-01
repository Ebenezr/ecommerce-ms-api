import { test, vi } from 'vitest';
import * as utils from '../src/utils/index';
import amqplib from 'amqplib';

// vi.mock('amqplib', {
//   connect: async () => ({ createChannel: async () => {} }),
// } as any);

test.skip('creates a channel', async ({ expect }) => {
  const mockChannel = { assertQueue: () => {} };
  const mockConnection = { createChannel: async () => mockChannel };
  //   vi.mock('amqplib', { connect: async () => mockConnection } as any);

  //   const result = await utils.CreateChannel();

  //   expect(result).toBe(mockChannel);
});

// test('publishes a message', ({ expect }) => {
//   const publish = mock.fn();
//   const mockChannel = { publish };
//   const service = 'service';
//   const msg = 'message';

//   utils.PublishMessage(mockChannel, service, msg);

//   expect(publish).toHaveBeenCalledWith(
//     utils.EXCHANGE_NAME,
//     service,
//     Buffer.from(msg)
//   );
// });
