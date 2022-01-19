import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from './token.service';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    url: string;
    public authUser = {
        access_all_clients: 0,
        created_at: null,
        id: 0,
        is_blocked: 0,
        is_deleted: 0,
        message_view: 0,
        quick_send: 0,
        name: '',
        email: '',
        mobile: '',
        updated_at: null,
        user_type_id: 0,
        username: '',
        reason: '',
        is_privileged: 0,
        is_enabled: 0,
        service_missCall: 0,
        service_whatsapp: 0,
        user_type: {
            id: 0,
            name: 'Admin',
            business_title_id: 1,
        },
        client: null,
        reseller: {
            id: 0,
            company_name: null,
            domain: null,
            logo: null,
            logo_path: null,
            favicon: null,
            favicon_path: null,
            can_access_root_domain: 0,
        },
        otpChannels: [],
    };
    gettingUserDetails = false;
    public userData: any;
    
    constructor(
        private apiService: ApiService,
        private tokenService: TokenService,
        private http: HttpClient
    ) {
        this.url = this.apiService.baseUrl;
        this.getUserDetails();
        
    }

    reset() {
        this.url = '';
        this.authUser = {
            access_all_clients: 0,
            created_at: null,
            id: 0,
            is_blocked: 0,
            is_deleted: 0,
            message_view: 0,
            quick_send: 0,
            name: '',
            email: '',
            mobile: '',
            updated_at: null,
            user_type_id: 0,
            username: '',
            is_privileged: 0,
            reason: '',
            is_enabled: 0,
            service_missCall: 0,
            service_whatsapp: 0,
            user_type: {
                id: 0,
                name: 'Admin',
                business_title_id: 1,
            },
            client: {},
            reseller: {
                id: 0,
                company_name: null,
                domain: null,
                logo: null,
                logo_path: null,
                favicon: null,
                favicon_path: null,
                can_access_root_domain: 0,
            },
            otpChannels: [],
        };
        localStorage.setItem('authUser', JSON.stringify(this.authUser));
    }

    getUserDetails() {
        this.userData = localStorage.getItem("authUser");
        this.authUser = JSON.parse(this.userData); 
    }

    
}
