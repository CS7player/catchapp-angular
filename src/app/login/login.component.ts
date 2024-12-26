import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../utils/apimanager.service';
// import { SocketService } from '../utils/socket.service';
import { LsmanagerService } from '../utils/lsmanager.service';
import { Constants } from '../utils/constants.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  headingTitle : string = 'Login';
  username : string = '';
  password: string = '';
  con_password: string = '';
  btnText : string = 'Login';
  is_password : boolean = false;
  is_con_password : boolean = false;
  is_signUp: boolean = false;
  is_loader : boolean = false;
  constructor(private apiservice : ApiService,private router: Router,private ls : LsmanagerService){}

  validation(){
    if(this.username.length <= 4){
      alert('Minimum character in username is 5')
      return 
    }
    if(this.password.length <= 4){
      alert('Minimun character in password is 5')
      return 
    }
    this.submit();
  }
  submit(){
    // this.is_loader = true;
    if(this.btnText == 'Login'){
      this.loginSubmit();
    }
    else{
      if(this.password != this.con_password){
        alert('Please Check your Password');
        return 
      }
      this.signUpSubmit();
    }
  }
  loginSubmit(){
    let params = {"username":this.username,"password":this.password}
    this.apiservice.dopost(Constants.URL+'user/login',params).subscribe({
      // this.is_loader = false;
      next:(res : any)=>{
        if(res['status']){
          this.ls.setData('userData',JSON.stringify(res['data']));
          this.router.navigate([`/layout`])
        }
        else{
          alert(res['msg'] || 'Details inCorrect');
        }
      },error:(err: any)=>{
        this.clear();
      }
    })
  }
  signUpSubmit(){
    let params = {"username":this.username,"password":this.password}
    this.apiservice.dopost(Constants.URL+'user/signUp',params).subscribe({
      next:(res : any)=>{
        if(res['status']){
          alert('Your Account is been Created Successfully!!!')
          // this.is_loader = true;
          this.login();
        }
      }
    })
  }

  signUp(){
    this.is_signUp = true;
    this.btnText = 'SignUp';
    this.clear();
  }

  login(){
    this.is_signUp = false;
    this.btnText = 'Login';
    this.clear()
  }

  clear(){
    this.username = '';
    this.password = '';
    this.con_password = '';
    this.is_password = false;
  }
}
