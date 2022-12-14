const assert = require("assert");

const app = require("./app");
const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;

chai.use(chaiHttp);

describe("App Config", function () {
    describe("#hbs_config", function () {
        it("should assert 200", function () {
            chai.request(app)
                .get("/")
                .end(function (err, res, body) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                });
        });
    });
});
