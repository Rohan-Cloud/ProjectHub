import { Injectable } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";
@Injectable()
export class Globals {
  Email: string = 'test';
  companyId():any
  {
    var data=this.decodeUserToken()
    if(data.RoleName=="Super Admin")
    {
      return atob(localStorage.getItem('CompanyId'));
    }
    else{
      return data.companyId;
    }
   
  }
  UserEmailId():any{
    var data=this.decodeUserToken()
    return data.EmailId;
  }
  UserId():any
  {
    var data=this.decodeUserToken()
    
    return data.UserId;
  }
  EmployeeId():any{
    var data=this.decodeUserToken()
    return data.EmployeeId;
  }
  RoleName():any
  {
    var data=this.decodeUserToken()
    return data.RoleName;
  }
  profile():any
  {
    return localStorage.getItem('profilephoto')
  }
  decodeUserToken() {
    var helper = new JwtHelperService();
    var token=localStorage.getItem('token')
      if (token) {
        var dtoken= helper.decodeToken(token);
        return dtoken
                    }
        }
  
}