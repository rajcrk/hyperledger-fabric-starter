/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context } from 'fabric-contract-api';
import { ChaincodeStub, ClientIdentity } from 'fabric-shim';
import { BatContract } from '..';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import winston = require('winston');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext implements Context {
    public stub: sinon.SinonStubbedInstance<ChaincodeStub> = sinon.createStubInstance(ChaincodeStub);
    public clientIdentity: sinon.SinonStubbedInstance<ClientIdentity> = sinon.createStubInstance(ClientIdentity);
    public logging = {
        getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
        setLevel: sinon.stub(),
     };
}

describe('BatContract', () => {

    let contract: BatContract;
    let ctx: TestContext;

    beforeEach(() => {
        contract = new BatContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"bat 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"bat 1002 value"}'));
    });

    describe('#batExists', () => {

        it('should return true for a bat', async () => {
            await contract.batExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a bat that does not exist', async () => {
            await contract.batExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createBat', () => {

        it('should create a bat', async () => {
            await contract.createBat(ctx, '1003', 'bat 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"bat 1003 value"}'));
        });

        it('should throw an error for a bat that already exists', async () => {
            await contract.createBat(ctx, '1001', 'myvalue').should.be.rejectedWith(/The bat 1001 already exists/);
        });

    });

    describe('#readBat', () => {

        it('should return a bat', async () => {
            await contract.readBat(ctx, '1001').should.eventually.deep.equal({ value: 'bat 1001 value' });
        });

        it('should throw an error for a bat that does not exist', async () => {
            await contract.readBat(ctx, '1003').should.be.rejectedWith(/The bat 1003 does not exist/);
        });

    });

    describe('#updateBat', () => {

        it('should update a bat', async () => {
            await contract.updateBat(ctx, '1001', 'bat 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"bat 1001 new value"}'));
        });

        it('should throw an error for a bat that does not exist', async () => {
            await contract.updateBat(ctx, '1003', 'bat 1003 new value').should.be.rejectedWith(/The bat 1003 does not exist/);
        });

    });

    describe('#deleteBat', () => {

        it('should delete a bat', async () => {
            await contract.deleteBat(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a bat that does not exist', async () => {
            await contract.deleteBat(ctx, '1003').should.be.rejectedWith(/The bat 1003 does not exist/);
        });

    });

});
