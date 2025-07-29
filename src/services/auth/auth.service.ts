import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendEmailVerification, sendPasswordResetEmail } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, from, switchMap, map } from 'rxjs';
import { Platform } from '@ionic/angular';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

// Firebase functions
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAEQRSHVie3gi1KJ-TQWScTzZ0oppNtt_8",
  authDomain: "pruebasdatabase-c194a.firebaseapp.com",
  projectId: "pruebasdatabase-c194a",
  storageBucket: "pruebasdatabase-c194a.firebasestorage.app",
  messagingSenderId: "571827057477",
  appId: "1:571827057477:web:1acae5c3addbc9b3f1842c",
  measurementId: "G-G9N2L3983K"
};

const TOKEN_KEY = 'jwt-token';
const helper = new JwtHelperService();

@Injectable({ providedIn: 'root' })
export class AuthService {
  public userData = new BehaviorSubject<any>(null);
  public adminSubject = new BehaviorSubject<boolean>(false);
  public $admin = this.adminSubject.asObservable();

  superUsuarios = [
    { correo: 'admin123@gmail.com' },
    { correo: 'admin12@gmail.com' },
    { correo: 'admin1@gmail.com' }
  ];

  constructor(
    private auth: Auth,
    private http: HttpClient,
    private router: Router,
    private storage: Storage,
    private platform: Platform,
  ) {
    this.platform.ready().then(() => this.initStorage());
    this.loadStoredToken();
    this.initializeFirebase();
  }

  private initializeFirebase() {
    // Inicializa Firebase en el servicio
    const app = initializeApp(firebaseConfig);
    getAnalytics(app); // Si necesitas analytics, puedes inicializarlo también
    this.auth = getAuth(app); // Inicializa Auth para usarlo en este servicio
  }

  private async initStorage() {
    await this.storage.create();
  }

  loadStoredToken() {
    const platformObs = from(this.platform.ready());
    return platformObs.pipe(
      switchMap(() => from(this.storage.get(TOKEN_KEY))),
      map(token => {
        if (token) {
          const decoded = helper.decodeToken(token);
          this.userData.next(decoded);
          return true;
        }
        return false;
      })
    );
  }

  async login(correo: string, passw: string) {
    const response = await this.http.post<any>(`${environment.apiUrl}/usuario/login`, { correo, passw }).toPromise();
    if (response && response.token) {
      const token = response.token;
      const decoded = helper.decodeToken(token);

      await this.storage.set(TOKEN_KEY, token);
      this.userData.next(decoded);

      const isSuperUser = this.superUsuarios.some(user => user.correo === correo);
      this.adminSubject.next(isSuperUser);

      return { success: true, data: response.result, token: response.token };
    }
    return { success: false };
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(this.auth, provider);
    console.log('Google Auth Result:', result.user);
    return result.user;
  }

  async logout() {
    await this.storage.remove(TOKEN_KEY);
    this.userData.next(null);
    this.adminSubject.next(false);
    window.location.reload();
  }

  async verifyEmail() {
    const user = this.auth.currentUser;
    if (user) {
      await sendEmailVerification(user);
      console.log('Correo de verificación enviado');
    }
  }

  async resetPass(email: string) {
    await sendPasswordResetEmail(this.auth, email);
  }
}
