/**
 * Here is interface you need to implement.
 * Please use only single .ts file for solution. Please make sure it can be compiled on Tyepscript 4 without
 * any additional steps and 3rd-party libs. Please use comments to describe your solution.
 *
 * This is spot provider, it stores information about ticking spots, and provide ability to requests like : what was the spot
 * at any given point in time.
 * CCYPAIR  is combination of two 3-chars currencies like "EURUSD" or "JPYRUB" and so on.  Always in uppercase.
 * SPOT is ticking value of given ccypair  like for "USDRUB" it can be 76.45 then 76.46 then 76.44 ...
 *
 * We can assume that all data fits in memory, so we don't need to store it anywhere.
 * But there is a  "SUPER" task to have some persisting logic. It is not mandatory task. So, up to you.
 *
 *
 * Please don't spend more then one hour on this task.
 * And one more hour on "SUPER" task, if you are ready to spend this time on it.(not mandatory)
 */

interface SpotStore {
  /**
   * We are connected to other system that feed us ticks from different markets.
   * When we receive new tick we call add() method to store it. So later we can use this information in get method.
   * Note that time is increasing at each tick for given ccypair.
   *
   * Time complexity:  add() should work faster than O(logN)
   *
   * @param ccypair always 6 chars uppercase, only valid CCY codes. maximum number of different strings is 100X100
   * @param spot just a double value for spot that changed at this tickTime
   * @param tickTime  time when this spot ticks.
   */
  add(ccypair: string, spot: number, tickTime: number): void;

  /**
   * This is the place where we try to understand what was the spot at some point in time.
   * Like  what was the spot at 5pm Moscow for "EURRUB".  Note that there can be no spot at exact given time,
   * so you need to return latest at this time.
   * @param ccypair always 6 chars uppercase, only valid CCY codes. maximum number of different strings is 100X100
   * @param dateTime point in time.
   * @return spot value at this given time
   */
  get(ccypair: string, dateTime: number): number;
}


/**
 * Solution for mandatory task.
 *
 *
 * I like to defining types by type aliases approach (even if I need to use it for primitives).
 * Because it's more informative in the codebase.
 * _More about this approach (@see https://youtu.be/h4WQRqNjmX0?t=1085)_
 */
export type CcypairType = string;
type TickTimeType = number;
type SpotType = number;

export interface CcypairValue {
  tickTime: TickTimeType,
  spot: SpotType
}

type CcypairValuesType = CcypairValue[];

/**
 * This is utility that find the latest added spot from the given `ccypairValues` list
 *
 * **Note:** I didn't add this function into class, because it has weak reference with it.
 * And if follows this logic, it conflicts with first SOLID principle.
 *
 * @param  ccypairValues values of selected ccypair
 * @return the latest added spot from the given ccypair list
 */
const getCcypairSpotByLatestTime = (ccypairValues: CcypairValuesType): SpotType =>  {
  /**
   * I didn't use sort for this case. Because latest actual information, that receive from other system, adds to the end of array.
   */
  const lastCcypairValue = ccypairValues[ccypairValues.length - 1];
  const { spot } = lastCcypairValue;
  return spot;
}

class SpotStoreClass implements SpotStore {
  private store: Map<CcypairType, CcypairValuesType>;
  constructor() {
    /**
     * First of all, I define the store, because it will need for working with the received data from the other system.
     *
     * _I select the `Map` structure, cause it works like hash-table data-structure.
     * In other words, it's native JavaScript implementation of hash-table._
     *
     * _It using will be good choice for the performance (time complexity) reasons._
     *
     * It's time complexity in big O notation:
     *
     * | Algorithm | Average | Worst case |
     * |-----------|---------|------------|
     * | Space     | O(n)    | O(n)       |
     * | Search    | O(1)    | O(n)       |
     * | Insert    | O(1)    | O(n)       |
     * | Delete    | O(1)    | O(n)       |
     *
     * But I think our hash-table won't have worst case. Because worst cases happened when it has collisions.
     * For preventing collisions the hash-table should follow next rules:
     * 1. low fill factor
     * 2. good hash-function (As `Map` is native JavaScript construction, I believe that engineers who designed it, created it as well)
     */
    this.store = new Map();
  }

  /**
   * Adds new information about the given Ccypair into the store
   */
  add(ccypair: CcypairType, spot: SpotType, tickTime: TickTimeType): void {
    /**
     * Checks if the store is already has the information about received ccypair.
     * If it has - inserts given data to exist list, otherwise - pull given data to the created array.
     * */
    const isGivenCcypairExist = this.store.has(ccypair);
    const newValueList = isGivenCcypairExist
        ? [
            ...this.store.get(ccypair) as CcypairValuesType,
          { tickTime, spot }
        ]
        : [ { tickTime, spot } ];
    this.store.set(ccypair, newValueList);
  }

  /**
   * Trying to get and return spot from the given ccypair and at the given time.
   * Otherwise, if it not found - finds and returns spot from the same ccypair, but latest at this time.
   */
  get(ccypair: CcypairType, dateTime: TickTimeType): SpotType {
    /**
     * I believe that class methods always get the correct and actual data for params.
     * I didn't write conditional blocks for these reasons.
     *
     * But if we can pull incorrect data into the method, we need to add proxy for it.
     * Proxy block should be checked this data, and if they're correct - send it into the necessary method.
     */
    const givenCcypairValues = this.store.get(ccypair) as CcypairValuesType;
    const foundCcypairValueByGivenTime = givenCcypairValues.find(({ tickTime }) => tickTime === dateTime);
    return foundCcypairValueByGivenTime?.spot ?? getCcypairSpotByLatestTime(givenCcypairValues);
  }
}







/**
 * "SUPER" task.  It is not mandatory task. So, up to you.
 * 
 * Let assume that our service is implemented in Reactor pattern (@see https://en.wikipedia.org/wiki/Reactor_pattern)
 * and we need to implement a processor of the requests that wiil be in front of our SpotStore.
 * In reactor pattern processor is just a loop that handles the quueue of the requests. But we don't want to loose
 * any "add price message" and also want to handle them as soon as possible. 
 * 
 * To sort it out we will use 2 queues of messages:
 * 1) for add requests 2) for get requests. Also we have a monitoring system that allows us to make some alerts if the processor
 * too slow. The alerting is triggered if the processor doesn't send a heart beet for 30 ms. So you need to implement queue 
 * processor so that it will handle all requests "add" queue as soon as possible, requests from "get" queue with any reasonable
 * speed and send a heart beat at least once per 40 ms.
 * Note: Processing of "add" requests is more important than monitoring. Also please add an example of unit test or any other demo
 * of service
 */
interface AddRequest {
  ccypair: string;
  spot: number;
  tickTime: number;
}

interface GetRequest {
  ccypair: string;
  dateTime: number;
  /** When you handle this request don't forget to call @param cb passing the result */
  cb: (value: number) => void;
}

interface MonitoringService {
    sendHeartBeat(): void;
}

/** Reactor will add "Add" request to the end of this queue */
const addRequestQueue: AddRequest[] = [];

/** Reactor will add "Get" request to the end of this queue */
const getRequestQueue: GetRequest[] = [];



module.exports = {
  SpotStoreClass,
  getCcypairSpotByLatestTime
};

