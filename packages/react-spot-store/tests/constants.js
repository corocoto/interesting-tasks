const { spotsFixture } = require('./fixtures');

const CCYPAIR_NAMES = {
    EURUSD: 'EURUSD',
    JPYRUB: 'JPYRUB',
    USDRUB: 'USDRUB'
};

const CCYPAIR_IDS = {
    [CCYPAIR_NAMES.EURUSD]: 0,
    [CCYPAIR_NAMES.JPYRUB]: 1,
    [CCYPAIR_NAMES.USDRUB]: 2
};

const EURUSD_SPOTS = spotsFixture.data.filter(({ccypairId}) => CCYPAIR_IDS[CCYPAIR_NAMES.EURUSD] === ccypairId);
const JPYRUB_SPOTS = spotsFixture.data.filter(({ccypairId}) => CCYPAIR_IDS[CCYPAIR_NAMES.JPYRUB] === ccypairId);
const USDRUB_SPOTS = spotsFixture.data.filter(({ccypairId}) => CCYPAIR_IDS[CCYPAIR_NAMES.USDRUB] === ccypairId);

module.exports = {
    CCYPAIR_NAMES,
    EURUSD_SPOTS,
    JPYRUB_SPOTS,
    USDRUB_SPOTS
};