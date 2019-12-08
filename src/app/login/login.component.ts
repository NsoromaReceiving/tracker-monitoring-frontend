import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { APIcallsService } from '../apicalls.service';
import { CookieService } from 'ngx-cookie-service';

interface User {
  user;
  password;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm;
  invalidLogin = false;

  constructor(private router: Router, private apiService: APIcallsService, private cookies: CookieService) { }

  ngOnInit() {

    this.loginForm = new FormGroup({
      password: new FormControl(null, [Validators.required]),
      user: new FormControl(null, [Validators.required]),
    });
  }


  onSubmit(user) {
    this.invalidLogin = false;
    console.log(user);
    this.apiService.login(user).subscribe((result: any) => {
      this.invalidLogin = false;
      this.cookies.set('token', result.token);
      console.log(result);
      this.router.navigate(['']);
      },
      (error) => {
        if (error.status === 401) {
          this.invalidLogin = true;
        }
      });
  }

}
