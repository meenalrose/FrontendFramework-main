import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-desktop-nav',
    templateUrl: './desktop-nav.component.html',
    styleUrls: ['./desktop-nav.component.scss'],
})
export class DesktopNavComponent implements OnInit {
    @Input() activatedModule: any;
    @Input() userService: any;
    @Input() mode: string = '';
    @Output() navigate = new EventEmitter();

    missCallMenu = {
        others: false,
    };

    whatsappMenu = {
        dashboard: false,
        others: false,
        manage: false,
    };
    backLink: string = '/';

    constructor() { }

    ngOnInit() {
        if (localStorage.getItem('currentPage')) {
            this.backLink = localStorage.getItem('currentPage');
        }

        this.checkSelectedModules();
    }

    checkSelectedModules() {
        this.missCallMenu = {
            others: false,
        };

        if (
            this.activatedModule.dashboard ||
            this.activatedModule.missedCalls ||
            this.activatedModule.historyReports ||
            this.activatedModule.numbers ||
            this.activatedModule.developers
        ) {
            this.missCallMenu.others = true;
        }

        this.whatsappMenu = {
            dashboard: false,
            others: false,
            manage: false,
        };

        if (
            this.activatedModule.notificationsDashboard ||
            this.activatedModule.subscribersDashboard
        ) {
            this.whatsappMenu.dashboard = true;
        }

        if (
            this.activatedModule.sendNotification ||
            this.activatedModule.whatsappChat ||
            this.activatedModule.whatsappHistoryReports ||
            this.activatedModule.whatsappCommunicationAnalytics ||
            this.activatedModule.whatsappDevelopers
        ) {
            this.whatsappMenu.others = true;
        }

        if (
            this.activatedModule.clientWhatsappNumber ||
            this.activatedModule.clientWhatsappNumberTemplate ||
            this.activatedModule.clientWhatsappNumberKeyword
        ) {
            this.whatsappMenu.manage = true;
        }
    }

    navigateTo(to: any) {
        this.navigate.emit(to);
        // this.checkSelectedModules();
    }
}
