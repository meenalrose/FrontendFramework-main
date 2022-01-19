import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('drawer') drawer: any;

  title: string = ''
  dateMessage: string = ''
  currentUrl: string = ''
  sideNote: string = ''
  backLink: string = '/'

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map((result) => result.matches))

  activatedModule = {
    bots: false,
    assignNumbers: false,
    keywords: false,
  }
  menuSize = 'big';
  parameters: any = null

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router
  ) {
    setInterval(() => {
      const currentDate = new Date();
      this.dateMessage = currentDate.toDateString() + ' ' + currentDate.toLocaleTimeString();
    }, 1000);
  }

  ngOnInit() {
    if (localStorage.getItem('currentPage')) {
      this.backLink = localStorage.getItem('currentPage');
    }

    this.router.events.subscribe(changeEvent => {
      if (changeEvent instanceof NavigationEnd) {
        console.log('changeEvent', changeEvent)
        console.log('changeEvent.url', changeEvent.url)

        this.currentUrl = changeEvent.url
        this.printTitle(changeEvent.url)
      }
    })
  }

  printTitle(url: string) {
    if (url === '/bots') {
      this.title = 'Bots';
      this.activatedModule.bots = true;
    }

    if (url === '/keywords') {
      this.title = 'Keywords';
      this.activatedModule.keywords = true;
    }

    if (url === '/assignNumbers') {
      this.title = 'Assign Numbers';
      this.activatedModule.assignNumbers = true;
    }
  }

  toggleDrawer() {
    if (this.drawer !== undefined) {
      this.drawer.toggle();
    }
  }

  toggleSize() {
    this.menuSize = this.menuSize === 'big' ? 'small' : 'big';
  }

  navigateTo(url: string, parameters = null) {
    this.toggleDrawer();
    this.activatedModule = {
      bots: false,
      assignNumbers: false,
      keywords: false,
    };
    this.parameters = parameters;

    this.router
      .navigate([url])
      .then((routed) => {
      })
      .catch((e) => {
        console.log(e);
      });
  }

  onActivate(componentReference: any) {
    if (typeof componentReference.initNavigationFilters !== 'undefined') {
      componentReference.initNavigationFilters(this.parameters);
    }
  }

  logout() {
    window.location.replace('/logout');
  }
}
