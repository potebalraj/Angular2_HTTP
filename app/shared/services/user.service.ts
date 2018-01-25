import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { User } from '../models/user';

@Injectable()
export class UserService {
    private usersUrl: string = 'https://reqres.in/api/users';

    // observable source
    private userCreatedSource = new Subject<User>();
    private userDeletedSource = new Subject();

    //Observable stream
    userCreated$ = this.userCreatedSource.asObservable();
    userDeleted$ = this.userDeletedSource.asObservable();

    constructor(private http: Http) { }

    /**
    * Get all users
    */
    getUsers(): Observable<User[]> {
        return this.http.get(this.usersUrl)
            .map(res => res.json().data)
            .map(users => users.map(this.toUser))
            .catch(this.handleError);
    }

    
    /**
    * Get a single user
    */
    getUser(id: number): Observable<User> {

        // Attaching a token
        let headers = new Headers();
        let token = localStorage.getItem('auth_token');
        headers.append('Content-type', 'application/json');
        headers.append('Authorization', `Bearer ${token}`);

        return this.http.get(`${this.usersUrl}/${id}`, { headers })
            .map(res => res.json().data)
            .map(this.toUser)
            .catch(this.handleError);
    }

    /**
    *  Create a user
    */
    createUser(user: User): Observable<User> {
        return this.http.post(this.usersUrl, user)
            .map(res => res.json())
            .do(user =>this.userCreated(user))
            .catch(this.handleError);
    }

    /**
    * Update a User
    */
    updateUser(user: User): Observable<User> {
        return this.http.put(`${this.usersUrl}/${user.id}`, user)
        //return this.http.get(`${this.usersUrl}/23`) // To check error message 
            .map(res => res.json())
            .catch(this.handleError);
    }

    /**
    * Delete a user
    */
    deleteUser(id: number): Observable<any> {
        return this.http.delete(`${this.usersUrl}/${id}`)
            .do(res => this.userDeleted())
            .catch(this.handleError);
    }

    /**
    * The user was created.Add this info to our stream.
    */
    userCreated(user: User) {        
        this.userCreatedSource.next(user);
    }

    /**
    * The user was Deleted .Add this info to our stream.
    */
    userDeleted() {        
        this.userDeletedSource.next();
    }

    /**
    * Convert User Infor from API to our standard/ format
    */
    private toUser(user): User {
        return {
            id: user.id,
            name: `${user.first_name} ${user.last_name}`,
            username: user.first_name,
            avatar: user.avatar
        }
    }
    
    /**
    * Handle any error from the API
    */
    private handleError(err) {
        let errorMessage: string;

        if (err instanceof Response) {
            let body = err.json() || '';
            let error = body.error || JSON.stringify(body);
            errorMessage = `${err.status} - ${err.statusText || ''} ${error}`;
        } else {
            errorMessage = err.message ? err.message : err.toString();
        }

        return Observable.throw(errorMessage);
    }
}