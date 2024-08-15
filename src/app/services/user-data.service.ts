import { Injectable } from '@angular/core';
import { getDatabase, ref, set, update, get } from 'firebase/database';
import { User } from '../models/user.model';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HandleLocalStorageService } from './handle-local-storage.service';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { enviroment } from 'src/environments/environment';
import { remove } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  private db;
  private userData: User = {
    uid: '',
    email: '',
    name: '',
    phone: '',
    address: '',
    rol: {
      val: 'customer'
    }
  }
  userDataSub = new BehaviorSubject<User>(this.userData);
  isAdminSub = new BehaviorSubject<any>(null);

  constructor(
    private _http: HttpClient,
    private handleLocalStorageService: HandleLocalStorageService
  ) {
    const app = initializeApp(enviroment.firebase);
    this.db = getDatabase(app);
  }

  /** Saves new user data in Firebase DB */
  createNewUser(name: string | null, email: string, uid: string) {
    this.userData.name = name!;
    this.userData.email = email;
    this.userData.uid = uid;
    this.userData.rol = { val: 'customer' }; // Ensure the role is set

    const userRef = ref(this.db, 'users/' + this.userData.uid);
    set(userRef, this.userData).then(() => {
      this.getUserDataFromFirebase();
    });
    this.userDataSub.next(this.userData);
  }

  getUserDataObservable() {
    return this.userDataSub.asObservable();
  }

  getUserDataFromFirebase() {
    const user = this.handleLocalStorageService.getUser();
    if (user != null) {
      const auth = getAuth();
      onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          console.log('Usuario autenticado:', firebaseUser);
          firebaseUser.getIdToken().then((token) => {
            console.log('Token de autenticación obtenido:', token);
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
            this._http.get<User>(`${enviroment.firebase.databaseURL}/users/${localStorage.getItem('user')}.json`)
              .subscribe({
                next: (data: User) => {
                  this.processUserData(data);
                },
                error: (error) => {
                  console.error('Error al obtener datos del usuario:', error);
                }
              });
          }).catch((error) => {
            console.error('Error al obtener el token de autenticación:', error);
          });
        } else {
          console.error('Usuario no autenticado');
        }
      });
    } else {
      console.error('No se encontró el usuario en el almacenamiento local');
    }
  }


  private processUserData(data: User) {
    this.userData = data;
    this.userDataSub.next(this.userData);
    this.handleLocalStorageService.setUserName(this.userData.name!);

    // set isAdmin value
    if (data.rol.val === 'admin') {
      this.handleLocalStorageService.setIsAdmin('true');
      this.isAdminSub.next(true);
    } else if (data.rol.val === 'customer') {
      this.isAdminSub.next(false);
      this.handleLocalStorageService.setIsAdmin('false');
    }
  }

  getIsAdminObservable() {
    this.isAdminSub.next(this.userData.rol.val === 'admin');
    return this.isAdminSub.asObservable();
  }

  updateUserData(userDataParam: User): Promise<void> {
    this.handleLocalStorageService.setUserName(userDataParam.name!);
    this.userDataSub.next(userDataParam);

    const userRef = ref(this.db, `users/${userDataParam.uid}`);
    return update(userRef, userDataParam);
  }

  async getUserById(uid:string){
    const path = `${enviroment.firebase.databaseURL}/users/${uid}.json`;
    console.log(path);
    return await this._http.get(path).toPromise();
  }

  async removeUser(uid: string) {
    const path = ref(this.db, `users/${uid}`)
    console.log('attach to: ',path)
    return remove(path)
  }
  
  updateUserRole(uid: string, newRole: string): Promise<void> {
    const userRef = ref(this.db, `users/${uid}/rol`);
    return update(userRef, { val: newRole });
  }
  

  async checkAddressPresentOrNot() {
    if (this.handleLocalStorageService.getUser() != null) {
      return await this.getAddressFromFirebase();
    }
  }

  async getAddressFromFirebase() {
    const addressRef = ref(this.db, `/users/${localStorage.getItem('user')}/address`);
    console.log(addressRef);
    const snapshot = await get(addressRef);
    return snapshot.exists() ? snapshot.val() : null;
  }

  async getAllUsersData() {
    const userRef = enviroment.firebase.databaseURL + `/users.json`
    return await this._http.get(userRef).toPromise();
  }

  clearUserDataLocally() {
    Object.entries(this.userData).forEach(([key, val]) => {
      if (key === 'rol') {
        this.userData.rol.val = 'customer';
      } else {
        (this.userData as any)[key] = null;
      }
    })
  }

  public set setUid(v: string) {
    this.userData.uid = v;
  }

  public get getUid() {
    return this.userData.uid;
  }

  public set setEmail(v: string) {
    this.userData.email = v;
  }

  public set setName(v: string) {
    this.userData.name = v;
  }

  public get getName() {
    return this.userData.name;
  }

  public set setPhone(v: string) {
    this.userData.phone = v;
  }

  public set setAddress(v: string) {
    this.userData.address = v;
  }


}
