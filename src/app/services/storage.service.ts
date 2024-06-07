import { Injectable, inject } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import {
    Storage,
    ref,
    deleteObject,
    listAll,
    uploadBytes,
    uploadString,
    uploadBytesResumable,
    percentage,
    getDownloadURL,
    getMetadata,
    provideStorage,
    getStorage,
    getBytes,
    ListResult,
    getBlob
} from '@angular/fire/storage';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    constructor(
        private storage: Storage
    ) { }


    storeFile(path: string, blob: Blob): Promise<unknown> {
        console.log(path, blob)
        const promise = new Promise((resolve, reject) => {
            if (path && blob) {
                console.log(path)
                // console.log(path, blob)
                const storageRef = ref(this.storage, path);
                return uploadBytesResumable(storageRef, blob)
                    .then((data: any) => {
                        // console.log(data)
                        resolve(getDownloadURL(storageRef))
                    })
                    .catch((err: FirebaseError) => {
                        console.log(`did not receive downloadUrl; ${err.message}`)
                    })

            } else {
                console.log('can\'t store object due to insufficient data');
                return 'can\'t store object due to insufficient data'
            }
        })
        return promise
    }

    deleteObject(path: string) {
        if (path) {
            const storageRef = ref(this.storage, path)
            return deleteObject(storageRef)
        }
        return;
    }
    getBlob(pathToBlob: string) {
        const storageRef = ref(this.storage, pathToBlob)
        return getBlob(storageRef)
    }
    checkForExistingFilename(path: string) {
        const storageRef = ref(this.storage, path)
        return getDownloadURL(storageRef)
    }
}
