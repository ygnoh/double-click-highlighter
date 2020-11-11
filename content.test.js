const {expect} = require("chai");
// const {run} = require("./content");

describe("check if it runs", () => {
    it("one plus one is two", () => {
        // given
        // when
        const result = 1 + 1;

        // then
        expect(result).to.be.eql(2);
    });
});
