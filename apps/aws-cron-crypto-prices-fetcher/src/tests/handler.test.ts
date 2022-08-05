import test from 'ava';
import sinon from 'sinon';
import {storePrices} from '../handler'

test('test on storePrices function', async t => {
    const storeInDB = sinon.stub();
    const exampleResp = {
        bitcoin: {
            usd: 23354
        },
        cardano: {
            usd: 0.509998
        }
    }
    await storePrices(storeInDB)(exampleResp, 1);
    t.true(storeInDB.calledTwice);
    t.true(storeInDB.calledWith("bitcoin", 23354, 1));
    t.true(storeInDB.calledWith("cardano", 0.509998, 1));
});
