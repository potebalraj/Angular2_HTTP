import { Component, OnInit} from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { User } from './shared/models/user';

import { UserService } from './shared/services/user.service';
import { AuthService } from './shared/services/auth.service';

@Component({
    selector: 'my-app',
    styles: [`
    .logout {cursor:pointer}
`],
    template: ` 
   <div class="container">
        <div class="navbar navbar-default">
            <div class="container-fluid">
                <div class="navbar-header">
                    <a routerLink="/" class="navbar-brand">My HTTP App</a>
                </div>
                <ul class="nav navbar-nav">
                    <li><a routerLink="/users">Users</a></li>
                </ul>

                <ul class="nav navbar-nav navbar-right">
                    <li *ngIf="!isLoggedIn"><a routerLink="/login">Login</a></li>                    
                    <li *ngIf="isLoggedIn"><a (click)="logOut()" class="logout">LogOut</a></li>
                </ul>
            </div>
        </div>
   </div>
    
    <router-outlet></router-outlet>
`
})

export class AppComponent implements OnInit {

    users: User[]

    constructor(
                private userservice: UserService,
                private authService: AuthService,
                private router: Router
                ) { }

    ngOnInit() {
        this.userservice.getUsers()
            .subscribe(
            users => this.users = users,
            err => {
                console.log(err);
            }
            );
    }

    /**
    * Is the user logged in
    */
    get isLoggedIn() {
        return this.authService.isLoggedIn();
    }

    /**
    * Log the user out
    */
    logOut() {
        this.authService.logOut();
        this.router.navigate(['/login']);
    }

}