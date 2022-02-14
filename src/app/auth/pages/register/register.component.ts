import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent  {

  miFormulario:FormGroup=this.fb.group({
    name:["test 4",[Validators.required]],
    password:["123456",[Validators.required,Validators.minLength(6)]],
    email:["test4@test.com",[Validators.required,Validators.email]]
  });

  constructor(private fb:FormBuilder, private router:Router,private authservice:AuthService) { }

  registro(){
    console.log(this.miFormulario.value);
    const {name,password,email}=this.miFormulario.value;
    
    this.authservice.registro(name,password,email).subscribe((ok:any)=>{
      if (ok===true) {
        this.router.navigateByUrl('/dashboard');
      }else{
        Swal.fire('Error',ok,'error')
      }
    })
  };
};
