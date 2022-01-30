import { CcypairType, CcypairValue } from '../../reactSpotStore';

const { SpotStoreClass } = require('../../reactSpotStore')

type CcypairIdType = number;
interface SpotFixture extends CcypairValue {
    ccypairId: CcypairIdType
}
type SpotsFixtureType = SpotFixture[];

/**
 * Fills `ccypairName` field for the given spot instance by `spotsInformation` array
 */
const addCcypairDataToStore = (
    ccypairName: CcypairType,
    spotsInformation: SpotsFixtureType,
    spotInstance: typeof SpotStoreClass
): void => {
    spotsInformation.forEach(({ spot, tickTime }) => {
        spotInstance.add(ccypairName, spot, tickTime);
    });
};

module.exports = addCcypairDataToStore;