import Realm from 'realm';
import { createRealmContext } from '@realm/react';

export class UserProfile extends Realm.Object<UserProfile> {
    id!: string;
    username!: string;
    firstName!: string;
    lastName!: string;
    email!: string;
    phone!: string;
    avatarUrl?: string;
    role!: string;
    createdAt!: string;

    static primaryKey = 'id';
}


const realmConfig: Realm.Configuration = {
    schema: [UserProfile],
    schemaVersion: 4,
    onMigration: (oldRealm, newRealm) => {
        if (oldRealm.schemaVersion < 4) {
            const oldObjects = oldRealm.objects('UserProfile');
            const newObjects = newRealm.objects<UserProfile>('UserProfile');
            for (let i = 0; i < oldObjects.length; i++) {
                const oldObj = oldObjects[i] as any;
                newObjects[i].phone = oldObj.phone ?? '';
                newObjects[i].createdAt = oldObj.createdAt ?? '';
            }
        }
    },
};

export const { RealmProvider, useRealm, useQuery, useObject } = createRealmContext(realmConfig);
