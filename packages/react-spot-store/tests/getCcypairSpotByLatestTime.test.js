/**
 * I use CommonJS format instead of ESM, because it's experimental Jest feature.
 * And it may have a bugs and missing features, that available for the CommonJS format.
 * @see https://jestjs.io/docs/ecmascript-modules
 */
const { getCcypairSpotByLatestTime, SpotStoreClass } = require('../reactSpotStore');
const { addCcypairDataToStore } = require('./utils');
const { USDRUB_SPOTS, CCYPAIR_NAMES } = require('./constants');

let spotStore;

beforeEach(() => {
    spotStore = new SpotStoreClass();
    addCcypairDataToStore(CCYPAIR_NAMES.USDRUB, USDRUB_SPOTS, spotStore);
});

describe('getCcypairSpotByLatestTime utility:', () => {
    it('should return the latest element\'s spot  from a given array', () => {
        expect(
            getCcypairSpotByLatestTime(USDRUB_SPOTS)
        ).toEqual(USDRUB_SPOTS[USDRUB_SPOTS.length - 1].spot);
    });
});

