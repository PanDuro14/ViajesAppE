import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalController, AnimationController, AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { Router} from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

// imports para formularios;
import { HttpClient } from '@angular/common/http';
import { FormGroup, Validators, FormBuilder, AbstractControl, FormControl } from '@angular/forms';

// imports de servicios
import { AuthService } from 'src/services/auth/auth.service';
import { UserService } from 'src/services/user/user.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonContent, CommonModule, FormsModule, ReactiveFormsModule],
  providers: [ModalController]
})
export class LoginPage implements OnInit {

  public isLoginModalOpen = false;
  public isSignUpMode = false;
  public admin = false;

  failedLoginAttemps: number = 0;

  allUsers: any[] = [];
  userSesion: any;
  userData: any;

  formSingup: FormGroup;
  formLogin: FormGroup;

  errorMessage: string = '';
  passwordFieldType: string = 'password';

  sidebarOpen = false;

  constructor(
    private modalController: ModalController,
    private animationCtrl: AnimationController,
    private router: Router,

    private userService: UserService,
    private authService: AuthService,
    private http: HttpClient,
    private fb: FormBuilder,
    private alertController: AlertController,
  ) {
    this.formSingup = this.fb.group({
      correo: ['',[ Validators.required, Validators.email ]],
      passw: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
      confirmPassw: ['', [Validators.required, this.confirmPasswordValidators.bind(this)]],
      username: ['', Validators.required],
    });

    this.formLogin = this.fb.group({
      'correo': new FormControl('', Validators.required),
      'passw': new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    console.log('[LoginPage] cargada correctamente');
  }

  // controlador de errores
  getErrorMessage(controlName: string){
    const control = this.formSingup.get(controlName);
    if(control?.hasError('required')){
      return 'Campo requerido';
    }
    if(control?.hasError('email')){
      return 'Correo electrónico inválido';
    }
    if(control?.hasError('minlength')){
      return 'Debe tener al menos 6 carácteres';
    }
    if(control?.hasError('pattern')){
      return 'Debe contener al menos una mayúscula, un número y un signo especial "@$!%*?&"';
    }
    return '';
  }

  // Obtener usuarios;
  getUsuario(){
    this.http.get<any>(`${environment.apiUrl}/usuario`).subscribe(
      (data) =>{
        this.allUsers = data;
        //console.log('getUsuario: ', data);
      }, (error) => {
        //console.error('Error al obtener ususarios', error);
      }
    );
  }

   // Obtener un email
  getOneEmail(correo: string): Promise<any>{
    return new Promise((resolve, reject) => {
      this.http.post<any>(`${environment.apiUrl}/usuario/email`, {correo})
      .subscribe(data => {
        this.userSesion = data[0];
        console.log('User sesion: ', this.userSesion);
        if(Object.keys(this.userSesion).length > 0){
          console.log(':D');
        }
        resolve(this.userSesion);
      }, (error) => {
        //console.error('Error al obtener a el usuario ', error);
        reject(error);
      });
    });
  }


  // inicializar la sesión actual
  async initCurrentSesion(correo?: string){
    if(!correo){
      correo = this.userService.getUserData()?.email || this.formLogin.get('correo')?.value;
      //console.log('initCurrentSesion: correo encontrado: ', correo);
    }
    if(!correo){
      //console.error('initCurrentSesion: No se pudo obtener un correo valido');
      return;
    }
    try{
      await this.getOneEmail(correo);
      const dataSesion = this.userSesion;
      //console.log('initCurrentSesion: Data sesion: ', dataSesion);

      if(dataSesion){
        this.userService.setCurrentSesion(dataSesion);
        //console.log('initCurrentSesion: Usuario en la sesión actual: ', dataSesion);
      } else {
        //console.error('initCurrentSesion: No se encontró ningún usuario con el correo proporcionado');
      }
    } catch( error ) {
      //console.error('initCurrentSesion: Error al obtener usuario', error);
    }
  }

  // almacernar usuario de google en la db
  async saveGoogleUser(){
    try {
      const Response = await this.getUsuario();
      //console.log('Datos del usuario obtenidos', Response);
    } catch (error){
      //console.error('Error al obtener usuarios: ', error);
    }

    const userData = this.userService.getUserData();
    if(userData){
      const email = userData.email;
      const emailExist = this.allUsers.some(user => user.correo === email);
      if(emailExist){
        this.formLogin.controls['correo'].setErrors({ emailExist: true});
        //console.log(email);
      } else {
        this.formLogin.controls['correo'].setErrors({ emailExist: false});
        //console.log('Email válido', email);
      }

      if (!emailExist){
        const nuevoUsuarioGoogle = {
          correo: userData.email,
          passw: 'GooglePass',
          username: userData.displayName,
        };

        console.log('Nuevo usuario de google ', nuevoUsuarioGoogle);

        this.http.post<any>(`${environment.apiUrl}/usuario`, nuevoUsuarioGoogle).subscribe(Response => {
          console.log('Usuario de google agregado con éxito', Response);
        }, (error) => {
          console.error('Error al agregar al usuario de google', error);
        });
        this.authService.verifyEmail();
        console.log('Correo enviado');
        alert('Se envió al correo: '+ email + '. Confirma para verificar');
      }
    } else {
      console.error('No se encontraron datos del usuario');
    }
  }

  // Obtener datos del usuario
  getUserData(){
    return this.userService.getUserData();
  }

  //logica para iniciar sesión
  login(event: Event) {
    event.preventDefault();

    const correo = this.formLogin.value.correo;
    const passw = this.formLogin.value.passw;

    //console.log('Intentando iniciar sesión con:', correo, passw);

    this.authService.login(correo, passw).then(response => {
      if (response && response.success) {
        const user = response.data[0];
        const token = response.token;

        localStorage.setItem('authToken', token);

        this.userService.setUserData(user);
        this.userService.setCurrentSesion(user);
        this.mostrarAlerta('¡Bienvenid@, '+ user.username +'! :D');
        this.closeLoginModal();
      } else {
        this.failedLoginAttemps++;
        this.mostrarAlerta('Correo o contraseña incorrectas');
        this.formLogin.controls['loginDenied'].setErrors({errorMessage: 'Contraseña o correo incorrectos' });
        //console.error('Correo o contraseña incorrectos');
      }
    }).catch(error => {
      this.failedLoginAttemps++;
      //console.error('Error en el proceso de inicio de sesión', error);
      this.mostrarAlerta('Correo o contraseña incorrectas');
      this.formLogin.controls['loginDenied'].setErrors({errorMessage: 'Contraseña o correo incorrectos' });
    });
  }

  // desactivar formulario y timer
  disabledLoginForTime(seconds: number){
    this.formLogin.disable();
    setTimeout(()=>{
      this.formLogin.enable();
      this.failedLoginAttemps = 0;
      this.errorMessage = '';
    }, seconds * 1000);
  }

  // iniciar una sesión con google
  async loginGoogle(){
    try{
      await this.authService.loginWithGoogle();
      await this.saveGoogleUser();
      try {
        await this.initCurrentSesion();
      } catch(error: any){
        //console.error('Error al establecer la sesión actual', error);
      }
    } catch (error: any){
      //console.error('Error al iniciar sesión con Google', error);
    }
  }

   // logica para crear un usuario
  getOneUsuario(idUsuario: number){
    this.http.get<any>(`${environment.apiUrl}/usuario` + idUsuario).subscribe(
      (data) => {
        //console.log('Usuario: ', data);
      },
      (error) => {
        //console.error('Error al obtener usuario', error);
      }
    );
  }

  // crear el usuario
  createOneUsuario(){
    if(this.formSingup.valid){
      const email = this.formSingup.value.correo;
      const username = this.formSingup.value.username;
      const emailExist = this.allUsers.some((user) => user.correo === email);
      const usernameExist = this.allUsers.some((user) => user.username === username);

      if(emailExist){
        this.formSingup.controls['correo'].setErrors({
          emailExist: true
        });
      }

      if(usernameExist){
        this.formSingup.controls['username'].setErrors({
          usernameExist: true
        });
      }

      if(!emailExist && !usernameExist){
        const nuevoUsuario = {
          correo: this.formSingup.value.correo,
          passw: this.formSingup.value.passw,
          username: this.formSingup.value.username,
        };
        this.http.post<any>(`${environment.apiUrl}/usuario`, nuevoUsuario)
        .subscribe((Response) => {
          console.log(Response);
          this.userService.setUserData(Response);
          this.userData = Response;
        },
        (error) => {
          //console.error('Error al agregar un usuario', error.error);
          }
        );
        this.showLoginForm();
        this.mostrarAlerta('Cuenta creada :D');
      }
    }
  }


  // borrar un usuario
  deleteUsuario(idUsuario: number){
    this.http.delete<any>(`${environment.apiUrl}/usuario` + idUsuario).subscribe((Response)=>{
      console.log('Usuario eliminado ', Response);
    },
    (error) => {
      console.error('Error al eliminar el usuario ', error);
    }
    );
  }

  // proceso para validar la contraseña
  confirmPasswordValidators(control: AbstractControl): {[key:string]: boolean } | null {
    if(!this.formSingup || !this.formSingup.get('passw')){
      return null ;
    }
    const passw = this.formSingup.get('passw')?.value;
    const confirmPassw = control.value;

    if (passw !== confirmPassw){
      return  {'passwordMismatch': true};

    } else {
      if(this.formSingup.get('passw')?.hasError('confirmPass')){
        this.formSingup.get('passw')?.setErrors(null);
      }
    }

    return null;
  }

  // drop sesion xd
  logout(){
    this.authService.logout();
  }


  // <---------------------------------------------- Fin de login y sing-up--------------------------------->

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'text' ? 'password' : 'text';
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  async openLoginModal() {
    this.isLoginModalOpen = true;
  }

  closeLoginModal() {
    this.modalController.dismiss();
    this.formLogin.reset();
    this.formSingup.reset();
    this.failedLoginAttemps = 0;
  }

  didDismissLoginModal() {
    this.isLoginModalOpen = false;
  }

  showLoginForm() {
    this.isSignUpMode = false;
  }

  showSignUpForm() {
    this.isSignUpMode = true;
  }

  enterAnimation = (baseEl: HTMLElement) => {
    const root = baseEl.shadowRoot || baseEl;
    const backdropAnimation = this.animationCtrl
      .create()
      .addElement(root.querySelector('ion-backdrop') || root)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');
    const wrapperAnimation = this.animationCtrl
      .create()
      .addElement(root.querySelector('.modal-wrapper') || root)
      .keyframes([
        { offset: 0, opacity: '0', transform: 'scale(0)' },
        { offset: 1, opacity: '0.99', transform: 'scale(1)' },
      ]);
    return this.animationCtrl
      .create()
      .addElement(baseEl)
      .easing('ease-out')
      .duration(500)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  leaveAnimation = (baseEl: HTMLElement) => {
    return this.enterAnimation(baseEl).direction('reverse');
  };

  // logica para crear mensajes
  public async mostrarAlerta(mensaje: string){
    const alert = await this.alertController.create({
      header: 'Alerta',
      message: mensaje,
      buttons: [{
        text: 'Ok',
        handler:() =>{
          //this.router.navigate(['home']);
        }
      }]
    });
    await alert.present();
  }
}

