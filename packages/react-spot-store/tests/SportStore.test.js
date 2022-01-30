/**
 * I use CommonJS format instead of ESM, because it's experimental Jest feature.
 * And it may have a bugs and missing features, that available for the CommonJS format.
 * @see https://jestjs.io/docs/ecmascript-modules
 */
const { SpotStoreClass } = require('../reactSpotStore.ts');
const { EURUSD_SPOTS, JPYRUB_SPOTS, USDRUB_SPOTS, CCYPAIR_NAMES } = require('./constants');
const { addCcypairDataToStore } = require('./utils')

let spotStore;
beforeEach(() => {
    spotStore = new SpotStoreClass();
});

describe('SpotStore class:', () => {
    it('store should be empty by default', () => {
        expect(spotStore.store.size).toEqual(0);
    });

    describe('`add` method: ', () => {
        it('store should contains one ccypair note after calling `add` method at once (with correct sending data)', () => {
            const [{ spot, tickTime }] = EURUSD_SPOTS;
            spotStore.add(CCYPAIR_NAMES.EURUSD, spot, tickTime);
            expect(spotStore.store.size).toEqual(1);
        });

        it('ccypair note in store should contains one item (after calling `add` method at once (with correct sending data))', () => {
            const [{ spot, tickTime }] = EURUSD_SPOTS;
            spotStore.add(CCYPAIR_NAMES.EURUSD, spot, tickTime);
            const ccypairStoreValueList = spotStore.store.get(CCYPAIR_NAMES.EURUSD);
            expect(ccypairStoreValueList).toHaveLength(1);
        });

        it('store should contains data that sent into `add` method ', () => {
            const [{ spot, tickTime }] = EURUSD_SPOTS;
            spotStore.add(CCYPAIR_NAMES.EURUSD, spot, tickTime);

            const lastAddedDataToStore = spotStore.store.get(CCYPAIR_NAMES.EURUSD);
            expect([{ spot, tickTime }]).toEqual(lastAddedDataToStore);
        });

        it('ccypair note in store should contains two items, if we trying to add 2 items for the same ccypair name', () => {
            // this test scenario checks rewrite behavior
            const [ firstSpotData, secondSpotData ] = EURUSD_SPOTS;
            addCcypairDataToStore(CCYPAIR_NAMES.EURUSD, [ firstSpotData, secondSpotData ], spotStore);
            const ccypairStoreValueList = spotStore.store.get(CCYPAIR_NAMES.EURUSD);
            expect(ccypairStoreValueList).toHaveLength(2);
        });

        it('ccypair note in store should contains spot data which sent into `add` method 2 times ', () => {
            const [ firstSpotData, secondSpotData ] = EURUSD_SPOTS;
            addCcypairDataToStore(CCYPAIR_NAMES.EURUSD, [ firstSpotData, secondSpotData ], spotStore);
            const ccypairStoreValueList = spotStore.store.get(CCYPAIR_NAMES.EURUSD);
            expect(
                ccypairStoreValueList
            ).toEqual(
                [
                    {
                        spot: firstSpotData.spot,
                        tickTime: firstSpotData.tickTime
                    },
                    {
                        spot: secondSpotData.spot,
                        tickTime: secondSpotData.tickTime
                    }
                ]
            );
        });

        it('ccypair note in store should contains two items, if we trying to add 2 identical items', () => {
            // this test scenario checks rewrite behavior
            const [ spotDetails ] = EURUSD_SPOTS;
            addCcypairDataToStore(CCYPAIR_NAMES.EURUSD, [ spotDetails, spotDetails ], spotStore);
            const ccypairStoreValueList = spotStore.store.get(CCYPAIR_NAMES.EURUSD);
            expect(ccypairStoreValueList).toHaveLength(2);
        });

        it('store should contains two ccypair elements, if we trying to add 2 items with different ccypair', () => {
            const [{ spot: eurUsdSpot, tickTime: eurUsdTickTime } ] = EURUSD_SPOTS;
            const [{ spot: jpyRubSpot, tickTime: jpyRubTickTime }] = JPYRUB_SPOTS
            spotStore.add(CCYPAIR_NAMES.EURUSD, eurUsdSpot, eurUsdTickTime);
            spotStore.add(CCYPAIR_NAMES.JPYRUB, jpyRubSpot, jpyRubTickTime);
            expect(spotStore.store.size).toEqual(2);
        });
    });


    describe('`get` method:', () => {
        beforeEach(() => {
            addCcypairDataToStore(CCYPAIR_NAMES.EURUSD, EURUSD_SPOTS, spotStore);
            addCcypairDataToStore(CCYPAIR_NAMES.JPYRUB, JPYRUB_SPOTS, spotStore);
            addCcypairDataToStore(CCYPAIR_NAMES.USDRUB, USDRUB_SPOTS, spotStore);
        });

        test('if spot has been found by the given time, it should be return', () => {
            const [{ spot: expectedSpot, tickTime }] = EURUSD_SPOTS;
           const foundSpot = spotStore.get(CCYPAIR_NAMES.EURUSD, tickTime);
           expect(foundSpot).toEqual(expectedSpot)
        });

        test('if spot hasn\'t been found by the given time, it should return latest actual spot', () => {
            const { spot: expectedSpot } = EURUSD_SPOTS[EURUSD_SPOTS.length - 1];
            const foundSpot = spotStore.get(CCYPAIR_NAMES.EURUSD, 0);
            expect(foundSpot).toEqual(expectedSpot)
        });
    })
});
