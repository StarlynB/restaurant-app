import { Injectable } from '@angular/core';
import { Database } from '@angular/fire/database';
import { Storage, ref, uploadBytesResumable, uploadString, getDownloadURL, deleteObject, uploadBytes } from '@angular/fire/storage';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemImageService {
  private basePath = '/uploads/images/';
  private imageUrl: string = '';
  private imageUrlSub = new Subject<string>();

  constructor(
    private db: Database,
    private storage: Storage
  ) { }


  //upload image file to Firebase storage
  pushImageToStorage(file: File, itemCategory: string): Observable<number> {
    const filePath = this.basePath + itemCategory + '/' + file.name;
    const storageRef = ref(this.storage, filePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      snapshot => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`upload is ${progress}% done`);
      },
      error => {
        console.log('upload failed', error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
          this.imageUrl = downloadURL;
          this.imageUrlSub.next(this.imageUrl);
        });
      }
    );

    return new Observable(observer => {
      uploadTask.on('state_changed',
        snapshot => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          observer.next(progress);
        },
        error => {
          observer.error(error);
        },
        () => {
          observer.complete();
        }
      );
    });
  }

  async deleteImage(imageUrl: string): Promise<void> {
    const storageRef = ref(this.storage, imageUrl);
    return await deleteObject(storageRef);
  }

  getImageUrlObservable(): Observable<string> {
    return this.imageUrlSub.asObservable();
  }

}
