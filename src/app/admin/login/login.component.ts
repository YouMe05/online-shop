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

  }

  usernamePasswordCheckMatch(): void{
    const username = this.formLogin.get('username')?.value;
    const password = this.formLogin.get('password')?.value;

    
  }

  onSubmit(): void {
    console.log('ข้อมูลที่กรอก:', this.formLogin);
    console.log('ค่าของข้อมูลที่กรอก:', this.formLogin.value);
    this.usernamePasswordCheckMatch();
    if (this.formLogin.valid) {
      this.formLogin.reset();
    } else {
      //console.log('ฟอร์มไม่ถูกต้อง');
      this.formLogin.markAllAsTouched();
    }
  }

  get f() {
    return this.formLogin.controls;
  }
}
