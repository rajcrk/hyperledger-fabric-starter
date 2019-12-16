/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from 'fabric-contract-api';

@Object()
export class Device {

    @Property()
    public id: string;
    public name: string;
    public ownerId: string;
    public description: string;
    public dateOfIssue: string;
    public dateOfReturn?: string;
    public keyword: string;
    public comment: string;
    public version: string;
}
