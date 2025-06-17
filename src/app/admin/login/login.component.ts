import { Component, inject } from '@angular/core';
import { Database, ref, set} from '@angular/fire/database';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  formLogin !: FormGroup;
  currentUser: any[] = [];
  private db = inject(Database);

  constructor(){
    this.formLogin = new FormGroup({
        username: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required),
      }
    );

    const adminRef = ref(this.db, 'admin/');
    set(adminRef, { 
      username: 'admin',
      password: 'admin',
    });

    // const adminRef = ref(this.db, 'admin/');
    // set(adminRef, { 
    //   username: this.formLogin.get('username')?.value,
    //   password: this.formLogin.get('password')?.value,
    // });
  }
}
