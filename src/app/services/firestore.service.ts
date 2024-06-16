

import { Injectable, inject } from '@angular/core';

import {
    addDoc,
    arrayRemove,
    arrayUnion,

    collection,
    collectionData,
    collectionGroup,
    deleteDoc,
    doc,
    docData,
    DocumentData,
    DocumentReference,
    Firestore,
    orderBy,
    query,
    setDoc,
    updateDoc,
    where,
} from '@angular/fire/firestore';
import { firstValueFrom, merge, Observable } from 'rxjs';
import { Artist } from '../models/artist.model';

@Injectable({
    providedIn: 'root'
})
export class FirestoreService {

    constructor() { }

    firestore = inject(Firestore)


    addDoc(path: string, data: object): Promise<DocumentReference<object, DocumentData>> {
        const collectionRef = collection(this.firestore, path)
        return addDoc(collectionRef, data)
    }

    collection(path: string): Observable<any[]> {
        const collectionRef = collection(this.firestore, path)
        return collectionData(collectionRef, { idField: 'id' })
    }

    async asyncCollection(path: string): Promise<any[]> {
        console.log('asyncCollection()')
        const collectionRef = collection(this.firestore, path)
        return await firstValueFrom(collectionData(collectionRef, { idField: 'id' }))
    }

    sortedCollection(path: string, orderedBy: string, direction: any): Observable<any[]> {
        const collectionRef = collection(this.firestore, path)
        const q = query(collectionRef, orderBy(orderedBy, direction))
        return collectionData(q, { idField: 'id' })
    }

    deleteDoc(path: string): Promise<void> {
        const docRef = doc(this.firestore, path)
        return deleteDoc(docRef);
    }
    updateDoc(path: string, value: any): Promise<void> {
        const docRef = doc(this.firestore, path)
        return updateDoc(docRef, value)
    }
    setDoc(path: string, object: object): Promise<void> {
        const docRef = doc(this.firestore, path);
        return setDoc(docRef, object)
    }
    getDoc(path: string): Observable<any> {
        const docRef = doc(this.firestore, path)
        return docData(docRef, { idField: 'id' })
    }

    async asyncGetDoc(path: string): Promise<any> {
        const docRef = doc(this.firestore, path)
        return await docData(docRef, { idField: 'id' })
    }

    async getDocAsync(path: string): Promise<DocumentData> {
        const docRef = doc(this.firestore, path)
        console.log(docData(docRef))
        return docData(docRef)
    }

    findDoc(path: string, field: string, value: string) {
        const collectionRef = collection(this.firestore, path)
        const queryRef = query(collectionRef, where(field, '==', value))
        return collectionData(queryRef, { idField: 'id' })
    }
    removeElementFromArray(pathToDocument: string, arrayName: string, value: object): Promise<void> {

        const docRef = doc(this.firestore, pathToDocument)
        return updateDoc(docRef, {
            [arrayName]: arrayRemove(value)
        })
    }
    addElementToArray(pathToDocument: string, arrayName: string, value: object): Promise<void> {
        console.log(arrayName)
        const docRef = doc(this.firestore, pathToDocument);
        return updateDoc(docRef, {
            // spiritsArray: arrayUnion(spirit)
            [arrayName]: arrayUnion(value)
        })
    }
    addElementToArrayF(pathToDocument: string, arrayName: string, value: object): Promise<void> {
        console.log(pathToDocument)
        console.log(arrayName)
        const docRef = doc(this.firestore, pathToDocument);
        return setDoc(
            docRef,
            {
                [arrayName]: arrayUnion(value)
            },
            {
                merge: true
            },
        )
    }
    updateField(path: string, fieldName: any, newValue: any) {
        const docRef = doc(this.firestore, path);
        return updateDoc(docRef, { [fieldName]: newValue })
    }
    findCollectionArray(path: string, fieldName: string, value: string) {
        const collectionRef = collection(this.firestore, path)
        const q = query(collectionRef, where(fieldName, '==', value))
        return collectionData(q, { idField: 'id' })
    }
}
