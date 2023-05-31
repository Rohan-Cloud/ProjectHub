import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, pipe, throwError, of} from "rxjs";
import { tap, map, mapTo, catchError } from 'rxjs/operators';
import { Tokens } from "app/models/token";

@Injectable({
    providedIn:'root'
})
export class AuthService{
    private readonly JWT_TOKEN='JWT_TOKEN';
    private readonly REFERESH_TOKEN='REFERESH_TOKEN';

    private loggedUser :string;

    constructor(private http : HttpClient){}

       
    isLoggedIn()
    {
        return !!localStorage.getItem('token');
    }
    getJwtTokens() {
        return localStorage.getItem(this.JWT_TOKEN);
    }
    private doLoginUser(username: string, tokens:Tokens) {
        this.loggedUser=username;
        this.storeTokens(tokens);
    }
    private storeTokens(tokens: Tokens) {
        localStorage.setItem(this.JWT_TOKEN,tokens.jwt);
        localStorage.setItem(this.REFERESH_TOKEN,tokens.refreshToken);
    }   

}