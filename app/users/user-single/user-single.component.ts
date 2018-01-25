import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/user';
 
@Component({   
    templateUrl: './app/users/user-single/user-single.component.html'
})

export class UserSingleComponent implements OnInit {

    user: User;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private service: UserService
    ) { }

    ngOnInit() {

        // grab the id from the url
        let id = this.route.snapshot.params['id'];

        // Use the user service to getUser()
        this.service.getUser(id)
            .subscribe(user => this.user = user);
    }

    /**
    * Delete a User
    */
    deleteUser() {
        this.service.deleteUser(this.user.id)
            .subscribe(data => {
                console.log('User was deleted');
                // Route back to users page
                this.router.navigate(['/users']);
            });
    }

}