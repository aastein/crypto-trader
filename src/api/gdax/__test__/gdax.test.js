import assert from 'assert';
import api from '../index';

const ex = api.gdax;
const session = '';

describe('gdax', () => {
  it('should get order', async () => {
    const orderId = '0';
    await ex.getOrder(orderId, session).then(res => {
      assert.equal(res.response.status, 401);
    });
  });
  it('should get orders', async () => {
    const productId = 'BTC-USD';
    await ex.getOrder(productId, session).then(res => {
      assert.equal(res.response.status, 401);
    });
  });
  it('should get accounts', async () => {
    await ex.getAccounts(session).then(res => {
      assert.equal(res.response.status, 401);
    });
  });
  it('should delete order', async () => {
    const orderId = 0;
    await ex.deleteOrder(orderId, session).then(res => {
      assert.equal(res.response.status, 401);
    });
  });
  it('should get fills', async () => {
    const orderId = 0;
    await ex.getFills(orderId, session).then(res => {
      assert.equal(res.response.status, 401);
    });
  });
});
