/**
 * Created by anthony on 08.07.17.
 */

const user = require('../../models/user');
const expect  = require("chai").expect;

describe("should find users", () => {
    describe("should find all users", () => {

        it("should add numbers", () => {
            const result = user.add(1, 2);

            expect(result).to.equal(3);
        });

        it("should fail to add numbers", () => {
            const result = user.add(1, 2);

            expect(result).to.not.equal(4);
        });
    });
});
