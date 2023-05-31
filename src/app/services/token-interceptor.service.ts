
import { Injectable } from "@angular/core";
import { HttpInterceptor } from "@angular/common/http";
@Injectable()

export class tokenintercepterService implements HttpInterceptor
{
    constructor(){}
    intercept(req,next)
    {
        let tokenizedRequest =req.clone({
            setHeaders:{
                Authorization:'Bearer '+ localStorage.getItem('token')                
            }            
        })    
        return next.handle(tokenizedRequest);
    }
}