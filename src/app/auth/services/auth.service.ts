import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { authResponse, Usuario } from '../interfaces/interfaces';
import {catchError, map, tap} from 'rxjs/operators'
import { of, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private baseUrl:string=environment.baseUrl;
  private _usuario!:Usuario;

  get Usuario(){
   return {...this._usuario};
  }

  constructor(private http:HttpClient) { }

  registro(name:string,password:string,email:string){
    
    const url=`${this.baseUrl}/auth/new`;
    const body={email,password,name};

    return this.http.post<authResponse>(url,body)
    .pipe(
      tap(resp=>{
        if (resp.ok) {
          localStorage.setItem('token',resp.token!);
        };
      }),
      map(resp=>resp.ok),
      catchError(err=>of(err.error.msg ))
    )
  };

  login(email:string,password:string){
    
    const url=`${this.baseUrl}/auth`;
    
    const body={email,password};
    
    return this.http.post<authResponse>(url,body)
    .pipe(
      tap(resp=>{
        if (resp.ok) {
          localStorage.setItem('token',resp.token!);
        };
      }),
      map(resp=>resp.ok),
      catchError(err=>of(err.error.msg))
    );
  };

  validarToken():Observable<boolean>{
    const url=`${this.baseUrl}/auth/renew`;
    const headers= new HttpHeaders().set('x-token',localStorage.getItem('token')||"")
  
     return this.http.get<authResponse>(url,{headers})
     .pipe(
       map(resp=>{
        localStorage.setItem('token',resp.token!);
        this._usuario={
          name:resp.name!,
          uid:resp.uid!,
          email:resp.email!
        };
       return resp.ok;
      }),
       catchError(err=>of(false))
    );
  };

  logout(){

    localStorage.clear();

  };
  
};
