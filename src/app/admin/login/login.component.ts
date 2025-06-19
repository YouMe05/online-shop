import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Database, onValue, ref, set} from '@angular/fire/database';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  formLogin !: FormGroup;
  private db = inject(Database);
  private router = inject(Router);
  currentUser: any = '';

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

    const adminRef = ref(this.db, 'admin/');
    onValue(adminRef, snapshot => {
      const data = snapshot.val();

      if (!data) {
        alert('ไม่พบข้อมูลผู้ดูแลระบบในฐานข้อมูล');
        return;
      }

      const correctUsername = data.username;
      const correctPassword = data.password;

      if (username === correctUsername && password === correctPassword) {
        this.router.navigate(['/product-management']);

        sessionStorage.setItem(
          'currentUser',
          JSON.stringify({role: 'admin' })
        );

      } else {
        alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      }
    }, { onlyOnce: true });
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

  goToProductList() {
    this.router.navigate(['/product-list']);
  }

  get f() {
    return this.formLogin.controls;
  }
}
